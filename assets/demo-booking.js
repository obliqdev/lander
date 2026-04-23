(function () {
  const widget = document.getElementById('demoBookingWidget');
  if (!widget) return;

  const endpoint = widget.dataset.endpoint || 'http://localhost:5001/availability';
  const chargeEndpoint = widget.dataset.chargeEndpoint
    || endpoint.replace(/\/availability\/?$/, '/order/charge')
    || 'http://localhost:5001/order/charge';
  const service = widget.dataset.service || '';
  const duration = widget.dataset.duration || '';
  const durationId = widget.dataset.durationId || '6990df26ce62b53365b3d207';
  const productId = widget.dataset.productId || '686202bc9a643851a7fe0d4c';
  const hostId = widget.dataset.hostId || '67843083f5a799d37a1891cc';
  const locationId = widget.dataset.locationId || '6812defd916256e45887d5d0';
  const userId = widget.dataset.userId || '6993dbc19af35e7752172eb7';
  const timezone = widget.dataset.timezone || 'America/Toronto';
  const tenantId = widget.dataset.tenantId || '';

  const monthLabelEl = document.getElementById('demoBookingMonthLabel');
  const dateGridEl = document.getElementById('demoBookingDateGrid');
  const timeListEl = document.getElementById('demoBookingTimeList');
  const statusEl = document.getElementById('demoBookingStatus');
  const formatToggleEl = document.getElementById('demoBookingFormatToggle');
  const formPaneEl = document.getElementById('demoBookingFormPane');
  const backButtonEl = document.getElementById('demoBookingBack');
  const selectedSlotEl = document.getElementById('demoBookingSelectedSlot');
  const formEl = document.getElementById('demoBookingForm');
  const formStatusEl = document.getElementById('demoBookingFormStatus');
  const successEl = document.getElementById('demoBookingSuccess');
  const nameInputEl = document.getElementById('demoBookingName');
  const emailInputEl = document.getElementById('demoBookingEmail');
  const phoneInputEl = document.getElementById('demoBookingPhone');

  if (!monthLabelEl || !dateGridEl || !timeListEl || !statusEl || !formatToggleEl || !formPaneEl || !backButtonEl || !selectedSlotEl || !formEl || !formStatusEl || !successEl || !nameInputEl || !emailInputEl || !phoneInputEl) return;

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let selectedDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let viewMonthDate = new Date(now.getFullYear(), now.getMonth(), 1);
  let use24Hour = false;
  let selectedSlot = null;

  const slotsByDay = new Map();
  const parsedDurationMinutes = Number.parseInt(duration, 10);
  const slotStepMinutes = Number.isFinite(parsedDurationMinutes) && parsedDurationMinutes > 0
    ? parsedDurationMinutes
    : 30;

  function toYmd(date) {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function toDayKeyFromDate(date) {
    return toYmd(date);
  }

  function parseDateTime(value, dateHint) {
    if (!value) return null;

    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      return value;
    }

    if (typeof value === 'string') {
      const direct = new Date(value);
      if (!Number.isNaN(direct.getTime())) return direct;

      if (dateHint) {
        const withHint = new Date(`${dateHint}T${value}`);
        if (!Number.isNaN(withHint.getTime())) return withHint;
      }
    }

    return null;
  }

  function normalizePayload(payload) {
    const dates = [];

    const pushDate = (candidate, dateHint) => {
      const parsed = parseDateTime(candidate, dateHint);
      if (parsed) dates.push(parsed);
    };

    const parseSlotArray = (arr, dateHint) => {
      arr.forEach((slot) => {
        if (typeof slot === 'string' || slot instanceof Date) {
          pushDate(slot, dateHint);
          return;
        }

        if (slot && typeof slot === 'object') {
          const intervalStart = slot.startDate || slot.start || slot.startTime;
          const intervalEndValue = slot.endDate || slot.endDates || slot.endTime || slot.end;
          const intervalEnd = Array.isArray(intervalEndValue) ? intervalEndValue[0] : intervalEndValue;

          if (intervalStart) {
            const parsedStart = parseDateTime(intervalStart, dateHint);
            const parsedEnd = parseDateTime(intervalEnd, dateHint);

            if (parsedStart) {
              if (!parsedEnd || parsedEnd.getTime() <= parsedStart.getTime()) {
                dates.push(parsedStart);
                return;
              }

              let cursor = parsedStart.getTime();
              const endTime = parsedEnd.getTime();
              const stepMs = slotStepMinutes * 60 * 1000;

              while (cursor < endTime) {
                dates.push(new Date(cursor));
                cursor += stepMs;
              }
              return;
            }
          }

          const value = slot.start
            || slot.startTime
            || slot.dateTime
            || slot.datetime
            || slot.time
            || slot.slot;
          pushDate(value, dateHint);
        }
      });
    };

    if (Array.isArray(payload)) {
      parseSlotArray(payload);
    } else if (payload && typeof payload === 'object') {
      const arrayCandidates = [
        payload.data,
        payload.slots,
        payload.availableSlots,
        payload.availability,
        payload.results,
      ];

      const firstArray = arrayCandidates.find(Array.isArray);
      if (firstArray) {
        parseSlotArray(firstArray);
      } else {
        Object.entries(payload).forEach(([key, value]) => {
          if (/^\d{4}-\d{2}-\d{2}$/.test(key) && Array.isArray(value)) {
            parseSlotArray(value, key);
          }
        });
      }
    }

    return dates;
  }

  function formatTime(date) {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: !use24Hour,
    }).format(date).replace(' ', '').toLowerCase();
  }

  function buildMonthRange(date) {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return { start, end };
  }

  function getTimeZoneOffset(date, timeZone) {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(date);

    const map = {};
    parts.forEach((part) => {
      if (part.type !== 'literal') {
        map[part.type] = part.value;
      }
    });

    const asUtc = Date.UTC(
      Number.parseInt(map.year, 10),
      Number.parseInt(map.month, 10) - 1,
      Number.parseInt(map.day, 10),
      Number.parseInt(map.hour, 10),
      Number.parseInt(map.minute, 10),
      Number.parseInt(map.second, 10),
      0,
    );

    return asUtc - date.getTime();
  }

  function zonedDateTimeToUtc(year, month, day, hour, minute, second, millisecond, timeZone) {
    const guessUtc = Date.UTC(year, month - 1, day, hour, minute, second, millisecond);
    const offset = getTimeZoneOffset(new Date(guessUtc), timeZone);
    return new Date(guessUtc - offset);
  }

  function toUtcIsoDayRange(startDate, endDate, timeZone) {
    const from = zonedDateTimeToUtc(
      startDate.getFullYear(),
      startDate.getMonth() + 1,
      startDate.getDate(),
      0,
      0,
      0,
      0,
      timeZone,
    ).toISOString();

    const to = zonedDateTimeToUtc(
      endDate.getFullYear(),
      endDate.getMonth() + 1,
      endDate.getDate(),
      23,
      59,
      59,
      999,
      timeZone,
    ).toISOString();

    return { from, to };
  }

  function formatSlotSummary(date) {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  }

  function openFormForSlot(slot) {
    selectedSlot = slot;
    selectedSlotEl.textContent = formatSlotSummary(slot);
    formPaneEl.classList.remove('is-success');
    successEl.hidden = true;
    formStatusEl.textContent = '';
    widget.classList.add('is-booking-form');
    nameInputEl.focus();
  }

  function showPicker() {
    widget.classList.remove('is-booking-form');
    formPaneEl.classList.remove('is-success');
    successEl.hidden = true;
    formStatusEl.textContent = '';
  }

  function renderMonthLabel() {
    const monthText = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
    }).format(viewMonthDate);

    const [monthName, year] = monthText.split(' ');
    monthLabelEl.innerHTML = `<strong>${monthName}</strong> ${year}`;
  }

  function renderTimes() {
    const dayKey = toYmd(selectedDate);
    const slots = (slotsByDay.get(dayKey) || []).slice().sort((a, b) => a.getTime() - b.getTime());

    timeListEl.innerHTML = '';

    if (!slots.length) {
      const empty = document.createElement('p');
      empty.className = 'demo-widget-status';
      empty.textContent = 'No times for this date.';
      timeListEl.appendChild(empty);
      return;
    }

    slots.forEach((slot) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = formatTime(slot);
      button.addEventListener('click', () => {
        openFormForSlot(slot);
      });
      timeListEl.appendChild(button);
    });
  }

  function renderDateGrid() {
    dateGridEl.innerHTML = '';

    const monthStart = new Date(viewMonthDate.getFullYear(), viewMonthDate.getMonth(), 1);
    const monthEnd = new Date(viewMonthDate.getFullYear(), viewMonthDate.getMonth() + 1, 0);

    const leading = monthStart.getDay();
    for (let index = 0; index < leading; index += 1) {
      const empty = document.createElement('span');
      empty.className = 'muted';
      empty.textContent = '';
      dateGridEl.appendChild(empty);
    }

    for (let day = 1; day <= monthEnd.getDate(); day += 1) {
      const date = new Date(monthStart.getFullYear(), monthStart.getMonth(), day);
      const dayKey = toDayKeyFromDate(date);
      const hasSlots = (slotsByDay.get(dayKey) || []).length > 0;

      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = String(day);

      if (toYmd(selectedDate) === dayKey) {
        button.classList.add('is-selected');
      }

      if (!hasSlots) {
        button.classList.add('is-disabled');
        button.disabled = true;
      }

      button.addEventListener('click', () => {
        selectedDate = date;
        renderDateGrid();
        renderTimes();
      });

      dateGridEl.appendChild(button);
    }
  }

  async function fetchAvailability() {
    const { start, end } = buildMonthRange(viewMonthDate);
    const { from, to } = toUtcIsoDayRange(start, end, timezone);

    statusEl.textContent = 'Loading availability…';

    const search = new URLSearchParams({
      service,
      from,
      to,
    });

    if (duration) {
      search.set('duration', duration);
    }

    try {
      const requestHeaders = tenantId ? { 'X-Tenant-Id': tenantId } : undefined;
      const response = await fetch(`${endpoint}?${search.toString()}`, {
        headers: requestHeaders,
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const payload = await response.json();
      const slots = normalizePayload(payload);

      slotsByDay.clear();
      slots.forEach((slotDate) => {
        if (slotDate.getTime() < todayStart.getTime()) return;
        const key = toYmd(slotDate);
        const current = slotsByDay.get(key) || [];
        current.push(slotDate);
        slotsByDay.set(key, current);
      });

      renderMonthLabel();
      renderDateGrid();
      renderTimes();

      const totalSlots = Array.from(slotsByDay.values()).reduce((sum, daySlots) => sum + daySlots.length, 0);
      statusEl.textContent = totalSlots
        ? 'Select a date to view times.'
        : 'No times found in this date range.';
    } catch (error) {
      renderMonthLabel();
      dateGridEl.innerHTML = '';
      timeListEl.innerHTML = '<p class="demo-widget-status">Unable to load times right now.</p>';
      statusEl.textContent = 'Could not reach availability service.';
    }
  }

  formatToggleEl.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const nextFormat = target.dataset.format;
    if (!nextFormat) return;

    use24Hour = nextFormat === '24h';

    formatToggleEl.querySelectorAll('[data-format]').forEach((element) => {
      element.classList.toggle('is-active', element.getAttribute('data-format') === nextFormat);
    });

    renderTimes();
  });

  backButtonEl.addEventListener('click', () => {
    showPicker();
  });

  formEl.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!selectedSlot) return;

    const submitButton = formEl.querySelector('button[type="submit"]');
    const attendeeName = nameInputEl.value.trim();
    const attendeeEmail = emailInputEl.value.trim();
    const attendeePhone = phoneInputEl.value.trim();
    const note = [attendeeName, attendeeEmail, attendeePhone].filter(Boolean).join(' | ');

    const payload = {
      items: [
        {
          type: 'event',
          eventType: 'appointment',
          product: productId,
          quantity: 1,
          requiredWaivers: [],
          service,
          duration: durationId,
          host: hostId,
          location: locationId,
          startDate: selectedSlot.toISOString(),
          timezone,
          note,
          saveCardForLater: true,
        },
      ],
      discountMethods: [],
      paymentMethods: [],
      user: userId,
      saveCardForLater: true,
    };

    const requestHeaders = {
      'Content-Type': 'application/json',
    };
    if (tenantId) {
      requestHeaders['X-Tenant-Id'] = tenantId;
    }

    formStatusEl.textContent = 'Submitting request…';
    if (submitButton instanceof HTMLButtonElement) {
      submitButton.disabled = true;
    }

    fetch(chargeEndpoint, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(payload),
    })
      .then(async (response) => {
        if (!response.ok) {
          const responseText = await response.text().catch(() => '');
          throw new Error(responseText || `HTTP ${response.status}`);
        }
        formPaneEl.classList.add('is-success');
        successEl.hidden = false;
        formStatusEl.textContent = '';
      })
      .catch(() => {
        formStatusEl.textContent = 'Unable to submit right now. Please try again.';
      })
      .finally(() => {
        if (submitButton instanceof HTMLButtonElement) {
          submitButton.disabled = false;
        }
      });
  });

  fetchAvailability();
})();
