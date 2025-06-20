let displayTime;
let timeType;
let greeting = document.getElementById('Greeting');
let button = document.getElementById('updatebutton');
let removeButton = document.getElementById('updatebutton2');
let boxBg = document.getElementById('boxbg');
let box = document.getElementById('box');
let submit = document.getElementById('submit');
let alarmSubmit = document.getElementById('alarmsubmit');
let openAlarmBox = document.getElementById('openalarm');
let removeAlarm = document.getElementById('removealarm');
let alarmbox = document.getElementById('alarmbox');
let displayDay = document.getElementById('day');
let alarmsList = document.getElementById('alarms-list');
let d2 = new Date();
let month = d2.getMonth();
let date = d2.getDate();
let year = d2.getFullYear();
displayDay.textContent = month + "/" + date + "/" + year;
const sound = "alarm.mp3";
const audio = new Audio(sound);

let alarms = [];

function loadAlarms() {
  const saved = localStorage.getItem('alarms');
  if (saved) {
    alarms = JSON.parse(saved);
  } else {
    alarms = [];
  }
}

function saveAlarms() {
  localStorage.setItem('alarms', JSON.stringify(alarms));
}

function renderAlarms() {
  alarmsList.innerHTML = '';
  alarms.forEach((alarm, idx) => {
    let li = document.createElement('li');
    li.textContent = alarm;
    let removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.style.marginLeft = '10px';
    removeBtn.onclick = function() {
      alarms.splice(idx, 1);
      saveAlarms();
      renderAlarms();
    };
    li.appendChild(removeBtn);
    alarmsList.appendChild(li);
  });
  let alarmMsg = document.getElementById('alarm-message');
  if (!alarmMsg) {
    alarmMsg = document.createElement('span');
    alarmMsg.id = 'alarm-message';
    alarmbox.insertBefore(alarmMsg, removeAlarm);
  }
  if (alarms.length > 0) {
    alarmMsg.textContent = "Alarms set for: " + alarms.join(', ');
  } else {
    alarmMsg.textContent = "";
  }
}

function newNote() {
  boxBg.style.display = 'block';
}

function removeNotes() {
  boxBg.style.display = 'none';
}

function updateClock() {
  let d = new Date();
  let hours = d.getHours();
  let minutes = d.getMinutes();

  if (hours < 12) {
    greeting.textContent = "Good Morning";
  } else if (hours >= 18) {
    greeting.textContent = "Good Evening";
  } else if (hours >= 12 && hours < 18) {
    greeting.textContent = "Good Afternoon";
  }

  displayTime = document.getElementById('Time');
  let displayHours = String(hours).padStart(2, '0');
  let displayMinutes = String(minutes).padStart(2, '0');
  displayTime.textContent = displayHours + ":" + displayMinutes;

  let triggered = false;
  alarms.forEach((alarm, idx) => {
    if (displayTime.textContent === alarm) {
      if (!triggered) {
        audio.play();
        alert('Alarm for: ' + alarm);
        triggered = true;
      }
      alarms.splice(idx, 1);
      saveAlarms();
      renderAlarms();
    }
  });
}

function submitNote() {
  let newEL = document.createElement('li');
  let text = document.createTextNode(document.getElementById('input').value);
  newEL.appendChild(text);
  box.appendChild(newEL);
}

submit.addEventListener('click', submitNote);
button.addEventListener('click', newNote);
removeButton.addEventListener('click', removeNotes);

setInterval(updateClock, 1000);
updateClock();

function submitAlarm() {
  let alarmInput = document.getElementById('alarminput').value;
  let parts = alarmInput.split(':');
  if (parts.length === 2) {
    let hour = String(Number(parts[0])).padStart(2, '0');
    let min = String(Number(parts[1])).padStart(2, '0');
    let alarmStr = hour + ':' + min;
    if (!alarms.includes(alarmStr)) {
      alarms.push(alarmStr);
      saveAlarms();
      renderAlarms();
    }
  }
}

function openAlarm() {
  alarmbox.style.display = 'block';
  if (!document.getElementById('removealarm')) {
    let closeBtn = document.createElement('button');
    closeBtn.id = 'removealarm';
    closeBtn.textContent = 'Close';
    closeBtn.addEventListener('click', closeAlarm);
    alarmbox.appendChild(closeBtn);
  }
}

function closeAlarm() {
  alarmbox.style.display = 'none';
}

removeAlarm.addEventListener('click', closeAlarm);
alarmSubmit.addEventListener('click', submitAlarm);
openAlarmBox.addEventListener('click', openAlarm);

loadAlarms();
renderAlarms();
