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
    fillFieldContent(`day${suffixForFields}`,day);
    fillFieldContent(`year${suffixForFields}`,year);
    fillFieldContent(`hour${suffixForFields}`,hour);
    fillFieldContent(`minute${suffixForFields}`,minute);
    toggleAmPmForRow(time,hour);
};

const fillPresentTime = () => {
    const now = new Date();
    fillRow('present',now.getMonth(),now.getDay(),now.getFullYear(),now.getHours(),now.getMinutes());
};

const setClocks = () => {
    fillPresentTime();

};

window.addEventListener('DOMContentLoaded',()=> {
    setInterval(setClocks(),1000);
})