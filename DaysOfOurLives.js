"use strict";

var DaysOfOurLives = (function () {

  let dayTypeEnum = Object.freeze({
    NULL: '&nbsp;',
    PAST: '&#9642;',
    FUTURE: '&#9643;'
  });

  let getUrlVars = function () {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  };
  
  let parseBirthday = function () {
    var dateString = getUrlVars()['birthday'] || '1970-01-01';
    var parts = dateString.split(/\D+/);
    return new Date(parseInt(parts[0]), (parseInt(parts[1]) - 1), parseInt(parts[2]));
  };

  let parseYears = function () {
    return parseInt(getUrlVars()['years'] || '80');
  };

  let isBirthdayLeap = function () {
    return (birthday && birthday.getMonth() == 1 && birthday.getDate() == 29);
  };

  let addDay = function (today) {
    return new Date(today.getFullYear(), today.getMonth(), (today.getDate() + 1));
  };

  let newSpan = function (content) {
    return '<span>' + content + '</span>'; 
  };

  let createLifeYearHtml = function (fullYear, birthday, deathday) {
    let htmlYear = '';

    for (var currentDay = new Date(fullYear, 0, 1); currentDay.getFullYear() == fullYear; currentDay = addDay(currentDay)) {
      if (currentDay < birthday) {
        htmlYear += newSpan(dayTypeEnum.NULL);
      } else if ((currentDay <= deathday) && (currentDay <= Date.now())) {
        htmlYear += newSpan(dayTypeEnum.PAST);
      } else if ((currentDay <= deathday) && (currentDay > Date.now())) {
        htmlYear += newSpan(dayTypeEnum.FUTURE);
      } else {
        htmlYear += newSpan(dayTypeEnum.NULL);
      }

      if ((currentDay.getMonth() == 6) && (currentDay.getDate() == 2)) {
        htmlYear += '<br>';
      }
    }

    htmlYear += '<br>';
    return htmlYear;
  };

  let createLifeAllDaysHtml = function () {
    let birthday = parseBirthday();
    let totalAge = parseYears();
    let deathday = (isBirthdayLeap()) ?
      new Date(birthday.getFullYear() + totalAge, 2, 1) :
      new Date(birthday.getFullYear() + totalAge, birthday.getMonth(), birthday.getDate());
    
    let htmlAllDays = '<p>';

    for (var currentYear = birthday.getFullYear(); currentYear <= deathday.getFullYear(); ++currentYear) {
      htmlAllDays += createLifeYearHtml(currentYear, birthday, deathday);

      if ((currentYear + 1) % 10 == 0) {
        htmlAllDays += '</p><p>';
      }
    }

    htmlAllDays += '</p>';
    return htmlAllDays;
  };

  return {
    createHtmlAllDays: createLifeAllDaysHtml
  };

} ());