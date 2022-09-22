const fillFieldContent = (fieldId,value) => {
    document.getElementById(fieldId).innerText = value;
};

const toggleAmPmForRow = (time,hour) => {
    const suffixForAmPm = `-icon-${time}`;
    if (hour >= 12) {
        document.getElementById(`am${suffixForAmPm}`).classList.add('active');
        document.getElementById(`pm${suffixForAmPm}`).classList.remove('active');
    } else {
        document.getElementById(`am${suffixForAmPm}`).classList.remove('active');
        document.getElementById(`pm${suffixForAmPm}`).classList.add('active');
    }
};

const fillRow = (time,month,day,year,hour,minute) => {
    const suffixForFields = `-value-${time}`;
    fillFieldContent(`month${suffixForFields}`,month);
    fillFieldContent(`day${suffixForFields}`,`${day}`.padStart(2,'0'));
    fillFieldContent(`year${suffixForFields}`,year);
    fillFieldContent(`hour${suffixForFields}`,`${hour}`.padStart(2,'0'));
    fillFieldContent(`minute${suffixForFields}`,`${minute}`.padStart(2,'0'));
    toggleAmPmForRow(time,hour);
};

const getDestinationTimeFromQueryParam = () => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    return params.destinationTime;
};

const storeCurrentDestinationInLocalStorageAsLastDeparted = dest => localStorage.setItem('destinationTimeUnix', dest.getTime() / 1000);

const getLastDepFromLocalStorage = () => localStorage.getItem('destinationTimeUnix');

const fillDestinationTime = () => {
    const destinationTimeUnix = getDestinationTimeFromQueryParam();
    const dest = !destinationTimeUnix? new Date(Date.now()) : new Date(destinationTimeUnix *1000);

    storeCurrentDestinationInLocalStorageAsLastDeparted(dest);

    fillRow('destination',dest.toLocaleString('en-US', {month: 'short'}),dest.getDay(),dest.getFullYear(),dest.getHours(),dest.getMinutes());
}

const fillPresentTime = () => {
    const now = new Date(Date.now());
    fillRow('present',now.toLocaleString('en-US', {month: 'short'}),now.getDate(),now.getFullYear(),now.getHours(),now.getMinutes());
};

const fillLastDepartedTime = () => {
    const lastDepFromStorage = getLastDepFromLocalStorage();
    let lastDep = !lastDepFromStorage ? new Date(0) : new Date(lastDepFromStorage * 1000);
    fillRow('departure',lastDep.toLocaleString('en-US', {month: 'short'}),lastDep.getDay(),lastDep.getFullYear(),lastDep.getHours(),lastDep.getMinutes());
};

const setClocks = () => {
    //TODO fix me setting last departed from local storage depends on reverse order init
    fillLastDepartedTime();
    fillPresentTime();
    fillDestinationTime();

};

window.addEventListener('DOMContentLoaded',()=> {
    setInterval(setClocks(),1000);
})