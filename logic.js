const fillFieldContent = (fieldId, value) => {
    document.getElementById(fieldId).innerText = value;
};

const toggleAmPmForRow = (time, hour) => {
    const suffixForAmPm = `-icon-${time}`;
    if (hour >= 12) {
        document.getElementById(`am${suffixForAmPm}`).classList.add('active');
        document.getElementById(`pm${suffixForAmPm}`).classList.remove('active');
    } else {
        document.getElementById(`am${suffixForAmPm}`).classList.remove('active');
        document.getElementById(`pm${suffixForAmPm}`).classList.add('active');
    }
};

const fillRow = (time, month, day, year, hour, minute) => {
    const suffixForFields = `-value-${time}`;
    fillFieldContent(`month${suffixForFields}`, month);
    fillFieldContent(`day${suffixForFields}`, `${day}`.padStart(2, '0'));
    fillFieldContent(`year${suffixForFields}`, year);
    fillFieldContent(`hour${suffixForFields}`, `${hour}`.padStart(2, '0'));
    fillFieldContent(`minute${suffixForFields}`, `${minute}`.padStart(2, '0'));
    toggleAmPmForRow(time, hour);
};


const storeCurrentDestinationInLocalStorageAsLastDeparted = dest => localStorage.setItem('destinationTimeUnix', dest.getTime() / 1000);

const getLastDepFromLocalStorage = () => localStorage.getItem('destinationTimeUnix');

const fillDestinationTime = () => {
    const dest = new Date(Date.now());

    storeCurrentDestinationInLocalStorageAsLastDeparted(dest);

    fillRow('destination', dest.toLocaleString('en-US', {month: 'short'}), dest.getDay(), dest.getFullYear(), dest.getHours(), dest.getMinutes());
}

const fillPresentTime = () => {
    const now = new Date(Date.now());
    fillRow('present', now.toLocaleString('en-US', {month: 'short'}), now.getDate(), now.getFullYear(), now.getHours(), now.getMinutes());
};

const fillLastDepartedTime = () => {
    const lastDepFromStorage = getLastDepFromLocalStorage();
    let lastDep = !lastDepFromStorage ? new Date(0) : new Date(lastDepFromStorage * 1000);
    fillRow('departure', lastDep.toLocaleString('en-US', {month: 'short'}), lastDep.getDate(), lastDep.getFullYear(), lastDep.getHours(), lastDep.getMinutes());
};

const blinkSeconds = () => {
    document.querySelectorAll('.blinker').forEach(b => {
        if (b.classList.contains('active')) b.classList.remove('active');
        else b.classList.add('active');
    });
};

const updateLiveValues = () => {
    fillPresentTime();
    blinkSeconds();
};

const testInputAgainstRegex = (regex, event) => {
    const key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
};

const validateInputCharacter = event => {
    if (event.target.id.includes('month')) return testInputAgainstRegex(/[a-zA-Z]/, event);
    return testInputAgainstRegex(/[0-9]/, event);
};

const storeOriginalInnerTextOnFocus = event => {
    const target = event.target;
    tempEditStorage.set(target.id, target.innerText);
};

function restorePreviousValue(target) {
    target.innerText = tempEditStorage.get(target.id);
}

const validateOrResetInputOnBlur = event => {
    const target = event.target;
    if (target.id.includes('month') && !monthValidationRegex.test(target.innerText)
        || target.id.includes('day') && !dayValidationRegex.test(target.innerText)
        || target.id.includes('year') && !yearValidationRegex.test(target.innerText)
        || target.id.includes('hour') && !hourValidationRegex.test(target.innerText)
        || target.id.includes('minute') && !minuteValidationRegex.test(target.innerText)) {
        restorePreviousValue(target);
    }
};

const getValueFromDom = (id) => {
    return document.querySelector('#' + id).innerText;
}

const getMonthFromString = mon => new Date(Date.parse(mon + " 1, 2012")).getMonth();

const storeDestinationTimeFromDom = () => {
    const destTime = new Date();
    const destSuffix = '-value-destination';

    destTime.setMonth(getMonthFromString(getValueFromDom('month' + destSuffix)));
    destTime.setDate(getValueFromDom('day' + destSuffix));
    destTime.setFullYear(getValueFromDom('year' + destSuffix));
    destTime.setHours(getValueFromDom('hour' + destSuffix));
    destTime.setMinutes(getValueFromDom('minute' + destSuffix));

    localStorage.setItem('destinationTimeUnix', destTime.getTime() / 1000);
};

const removeGlowAnimation = () => {
    document.querySelectorAll('.glow-animation').forEach(e => e.classList.remove('glow-animation'))
}

const setDestinationTimeByUserInput = () => {
    const allValueFields = document.querySelectorAll('.value');
    [...allValueFields].forEach(en => {
        en.addEventListener('click', event => {
            removeGlowAnimation();
            storeOriginalInnerTextOnFocus(event)
        });
        en.addEventListener('keypress', event => validateInputCharacter(event))
        en.addEventListener('blur', event => {
            validateOrResetInputOnBlur(event);
            storeDestinationTimeFromDom();
        })
    });
};

let updateValuesInterval;
const setClocks = () => {
    //TODO fix me setting last departed from local storage depends on reverse order init
    fillLastDepartedTime();
    fillDestinationTime();

    clearInterval(updateValuesInterval);
    updateValuesInterval = window.setInterval(updateLiveValues, 1000);

    //imperformant as hell, but more convenient than having a separate gui for input
    setDestinationTimeByUserInput();
};

window.addEventListener('DOMContentLoaded', () => {
    setClocks();
})

const tempEditStorage = new Map();
const monthValidationRegex = /^[a-zA-Z]{3}$/;
const dayValidationRegex = /^(3[01]|[12][0-9]|[1-9])$/;
const yearValidationRegex = /^\d{4}$/;
const hourValidationRegex = /^(2[0-4]|1[0-9]|[1-9])$/;
const minuteValidationRegex = /^([0-5]?[0-9]|60)$/;

window.addEventListener("keypress", event => {
    if (event.key !== "Enter") return;
    event.preventDefault();

    setClocks();

    whiteBlast();
    explosionAnimation();
    spinCircuitsAndLicensePlate();
});

const whiteBlast = () => {
    const root = document.querySelector(`html`);
    root.classList.add('white-blast');
    root.addEventListener("webkitAnimationEnd", () => root.classList.remove('white-blast'));
}

const spinCircuitsAndLicensePlate = () => {
    const root = document.querySelector(`timer-wrapper`);
    root.classList.add('white-blast');
    root.addEventListener("webkitAnimationEnd", () => root.classList.remove('white-blast'));
}