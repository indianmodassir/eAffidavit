let  xhr;

let kbdLang = 'hi', kbdTheme = 'light', themeVariant = 1;

function $(selector, context) {
  return (context || document).querySelector(selector) || {};
}

function addClass(elem, className) {
  return elem.classList.add(className);
}

function removeClass(elem, className) {
  return elem.classList.remove(className);
}

function hasClass(elem, className) {
  return elem.classList.contains(className);
}

function hideLanguageBox() {
  addClass($('.lang_select'), 'hide');
}

function showLanguageBox() {
  removeClass($('.lang_select'), 'hide');
}

function toggleLanguageBox() {
  hasClass($('.lang_select'), 'hide') ? showLanguageBox() : hideLanguageBox();
}

function hideUploaderBox() {
  $('.confirm_uploader').style.display = 'none';
}
function showUploaderBox() {
  $('.dimension').textContent = $('#dimension').value + 'px';
  $('.confirm_uploader').style.display = 'block';
}

function hidePreview() {
  $('.preview_wrap').innerHTML = '';
  $('.preview_container').style.display = 'none';
}

document.addEventListener('click', function(e) {
  if (!hasClass(e.target, 'lang_selector')) {
    hideLanguageBox();
  }
});

function selectLang(elem) {
  let lang;
  $('#current_lang').textContent = lang = elem.dataset['value'];
  setStorage('lang', lang);
  setStorage('langId', elem.lang);
  dashboard();
}

function getStorage(name, force) {
  let data = window.localStorage.getItem(name) || force;
  try {
    data = JSON.parse(data);
  } catch(e) {}
  return data;
}

function setStorage(key, value) {
  window.localStorage.setItem(key, typeof value === 'object' ? JSON.parse(value) : value);
}

const stateHTML = `<select id="state" class="v-render" onchange="addrPicker(this.value, this.selectedIndex - 1)" required>
  <option value="" disabled hidden selected>राज्य / State</option>
  <option>ANDAMAN AND NICOBAR ISLANDS</option>
  <option>ANDHRA PRADESH</option>
  <option>ARUNACHAL PRADESH</option>
  <option>ASSAM</option>
  <option selected>BIHAR</option>
  <option>CHANDIGARH</option>
  <option>CHHATTISGARH</option>
  <option>DADRA AND NAGAR HAVELI</option>
  <option>DAMAN AND DIU</option>
  <option>DELHI</option>
  <option>GOA</option>
  <option>GUJARAT</option>
  <option>HARYANA</option>
  <option>HIMACHAL PRADESH</option>
  <option>JAMMU AND KASHMIR</option>
  <option>JHARKHAND</option>
  <option>KARNATAKA</option>
  <option>KERALA</option>
  <option>LAKSHADWEEP</option>
  <option>MADHYA PRADESH</option>
  <option>MAHARASHTRA</option>
  <option>MANIPUR</option>
  <option>MEGHALAYA</option>
  <option>MIZORAM</option>
  <option>NAGALAND</option>
  <option>ODISHA</option>
  <option>PUDUCHERRY</option>
  <option>PUNJAB</option>
  <option>RAJASTHAN</option>
  <option>SIKKIM</option>
  <option>TAMIL NADU</option>
  <option>TELANGANA</option>
  <option>TRIPURA</option>
  <option>UTTARAKHAND</option>
  <option>UTTAR PRADESH</option>
  <option>WEST BENGAL</option>
</select>`;

const casteSelect =  `<select id="caste_category" onchange="castePicker(this.value, this.selectedIndex -1)" required>
  <option value="" disabled hidden selected>जाति वर्ग / Caste Category</option>
  <option value="1" autocomplete="off">अत्यंत पिछड़ा वर्ग (अनुसूची-1)</option>
  <option value="2" autocomplete="off">पिछड़ा वर्ग (अनुसूची-2)</option>
  <option value="3" autocomplete="off">अनुसूचित जाति</option>
  <option value="4" autocomplete="off">अनुसूचित जनजाति</option>
  <option value="5" autocomplete="off">गैर आरक्षित</option>
</select>`;

/**
 * 
 * @param {*} routeName 
 * @param {*} label 
 */
function route(routeName, label) {
  if (typeof xhr === 'object') xhr.abort();
  removeClass($('#activated_link'), 'hide');
  $('#tabActive').textContent = label;
  $('#loaderContainer').showModal();

  xhr = new XMLHttpRequest();
  xhr.open('GET', 'pages/'+routeName+'.html', true);
  
  xhr.onload = function() {
    if (xhr.readyState === xhr.DONE && xhr.status >= 200) {
      $('.content').innerHTML = xhr.response;
      $('.pr-state').innerHTML = stateHTML;
      $('.caste-category').innerHTML = casteSelect;
      if ($('#state').nodeName) {
        addrPicker('BIHAR', 4);
      }
      selfDeclaration();
      const fields = document.querySelectorAll('.input');
      fields.forEach(function(field) {
        let input = field.querySelector('input');
        if (input && input.type !== 'number') {
          let keyboard = document.createElement('img');
          keyboard.src = 'assets/keyboard.svg';
          keyboard.classList.add('icon-keyboard');
          field.appendChild(keyboard);

          let loader = document.createElement('span');
          loader.innerHTML = `<svg width="22" height="22" viewBox="0 0 46 46" class="preloader">
              <circle cx="23" cy="23" r="18" stroke-width="4"></circle>
            </svg>`;
          
          loader.classList.add('lang-loader');
          field.appendChild(loader);

          keyboard.onclick = function() {
            new vkbd({lang: kbdLang, theme: kbdTheme, themeVariant}).open('#'+input.id);
          };
          
          input.oninput = async function() {
            if (kbdLang === 'hi') {
              let hiValue, rSpace = /\s$/, value = input.value,
                scalar = /^([\d.])?([a-z])/i,
                pos = input.selectionStart,
                testValue = value.substring(0, pos),
                beforeText = testValue.trim().split(' ').reverse()[0];

              if (rSpace.test(testValue) && scalar.test(beforeText)) {
                value = value.length > testValue.length ? xtrim(value) : value;
                hiValue = await hindi2English(value, input);
                input.value = hiValue;
                input.focus();
                doRende.call(input);
              }
            }
          };
        }
      });
    }
    $('#loaderContainer').close();
  };

  xhr.onerror =  xhr.ontimeout = function() {
    setTimeout(route, 5000, routeName);
  };

  xhr.send();
}

function capitalize(str) {
  return (str || '').replace(/[a-z]+/gi, function(letter) {
    return letter[0].toUpperCase() + letter.slice(1).toLowerCase();
  });
}

function loadSignature(e) {
  let file = e.target.files[0];

  $('.filename').textContent = file.name;
}

/**
 * 
 */
function reset() {
  let fields = document.querySelectorAll('.v-render'),
    form = document.forms[0];

  $('.filename').textContent = $('.total_income').textContent = '';
  form.reset();

  if ($('#total_income').classList) {
    $('#total_income').classList.remove('valid');
  }

  fields.forEach(function(el) {
    $('.' + el.id).textContent = '';
    el.classList.remove('active');
  });
}

/**
 * 
 * @param {*} lang 
 */
function switchKbdLang(lang) {
  kbdLang = lang;
  reset();
  $('#'+lang).checked = true;
}

function xtrim(str) {
  return str.match(/([^\s\n\r\t\f]+)/g).join(' ');
}

async function hindi2English(text, field) {
  const url = `https://inputtools.google.com/request?text=${encodeURIComponent(text)}&itc=hi-t-i0-und&num=1`;

  field.classList.add('active');
  return fetch(url).then(res => res.json()).then(data => {
    field.classList.remove('active');
    let hi_text = data[1][0][1][0];
    return kbdLang === 'hi' ? hi_text : text;
  });
}

function doRende() {
  let agriculterIncome  = +$('#agriculture_income').value || 0,
    otherIncome = +$('#other_income').value || 0,
    businessIncome = +$('business_income').value || 0,
    govtIncome = +$('#govt_income').value || 0,
    salaryIncome = +$('#salary_income').value || 0,
    elem = $('.' + this.id);

  elem.textContent = format(kbdLang === 'en' ? (this.nodeName === 'SELECT' ? this.value : capitalize(this.value)) : this.value);

  let total = agriculterIncome + otherIncome + businessIncome + govtIncome + salaryIncome;
  total = total === 0 ? '00' : total;
  $('#total_income').value = total;
  $('.total_income').textContent = total.toLocaleString();
  $('#place').value = $('#post_office').value;
  if ($('#total_income').classList) {
    $('#total_income').classList.add('valid');
  }
}

function format(value) {
  return /^[0-9]+$/.test(value) ? (+value).toLocaleString() : value;
}

function selfDeclaration() {
  let renders = document.querySelectorAll('.v-render');

  renders.forEach(function(el) {
    el.addEventListener(el.nodeName === 'SELECT' ? 'change' : 'input', doRende);
  });
}

function finishDownload(link, type) {
  if (!(link && type)) return;
  hidePreview();
  $('#activated_link').classList.add('hide');

  let num = '0123456789'.split('');
  let uid = '';

  for(let i = 0; i < 12; i++) {
    uid += num[Math.floor(Math.random() * num.length)];
  }

  uid = uid.match(/([\d]{4})/g).join(' ');

  $('.content').innerHTML = `<section id="content">
    <div class="form_container" style="width:100%;max-width:900px;margin:0 auto;display:flex;flex-direction:column;text-align:center;justify-content:center;row-gap:18px;padding-top:44px;">
      <div><img src="assets/success.svg" draggable="false"></div>
      <h1 style="color:#2072a0;font-weight:500;">Download Successfully</h1>
      <div style="color:#2072a0;">
        <p>Your Affidavit has been successfully downloaded whose Affidavit UID number is given below:</p>
        <p>आपका हलफनामा सफलतापूर्वक डाउनलोड हो गया है, जिसका हलफनामा यूआईडी नंबर नीचे दिया गया है:</p>
        <div style="font-weight:600;margin-top:8px;font-size:18px;color:#0b970b;">यूआईडी / UID: ${uid}</div>
        <div style="font-weight:600;margin-top:8px;font-size:18px;color:#0b970b;">शपथ पत्र का प्रकार / Affidavit Type: ${type}</div>
        <p style="margin-top:15px;">The affidavit you have downloaded is not password protected.</p>
        <p>आपने जो हलफनामा डाउनलोड किया है, वह पासवर्ड से सुरक्षित नहीं है।</p>
      </div>
      <div class="btn_wrap">
        <div class="btn_wrap" style="justify-content:center;margin:11px 0;display:flex;">
          <button type="button" onclick="dashboard()">
            <svg width="22" height="22" viewBox="0 0 46 46" class="preloader">
              <circle cx="23" cy="23" r="18" stroke-width="4"></circle>
            </svg>
            <span>Goto Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  </section>`;
  link.click();
}

function validateForm() {
  let district = ($('#district').value || '').split('/');
  let subDivision = ($('#sub_division').value || '').split('/');
  let block = ($('#block').value || '').split('/');
  let policeStation = ($('#police_station').value || '').split('/');
  let caste = ($('#caste').value || '').split('/');
  const isHi = kbdLang === 'hi';

  if (!district[1]) district[1] = district[0];
  if (!subDivision[1]) subDivision[1] = subDivision[0];
  if (!block[1]) block[1] = block[0];
  if (!policeStation[1]) policeStation[1] = policeStation[0];
  if (!caste[1]) caste[1] = caste[0];

  return {
    applicantName: capitalize($('#applicant').value),
    fatherName: capitalize($('#father').value),
    motherName: capitalize($('#mother').value),
    village: capitalize($('#village').value),
    postOffice: capitalize($('#post_office').value),
    policeStation: isHi ? policeStation[1] : capitalize(policeStation[0]),
    block: isHi ? block[1] : capitalize(block[0]),
    subDivision: isHi ? subDivision[1] : capitalize(subDivision[0]),
    dist: isHi ? district[1] : capitalize(district[0]),
    state: capitalize($('#state').value),
    caste: isHi ? caste[1] : capitalize(caste[0]),
    incomeFromGovt: +$('#govt_income').value,
    incomeFromBusiness: +$('#business_income').value,
    incomeFromAgriculture: +$('#agriculture_income').value,
    incomeFromOther: +$('#other_income').value,
    salaryIncome: +$('#salary_income').value,
    otherIncome: +$('#other_income').value,
    place: capitalize($('#place').value),
    mouza: capitalize($('#mouza').value),
    psNo: $('#psNo').value,
    halka: capitalize($('#halka').value),
    volumeNo: $('#volumeNo').value,
    pageNo: $('#pageNo').value,
    jamabandiNo: $('#jamabandiNo').value,
    j_dist: capitalize($('#j_district').value),
    j_block: capitalize($('#j_block').value),
    j_halka: capitalize($('#j_halka').value),
    j_mouza: capitalize($('#j_mouza').value),
    j_psNo: capitalize($('#j_psNo').value),
    number: $('#mobile').value,
    signature: $('#signature').files[0]
  };
}

/**
 * 
 */
function initAffidavit({target}, type) {
  let data;
  $('button[type=submit]').disabled = true;

  if ((data = validateForm(target))) {
    window[type](data).then(function(source) {
      const img = new Image;
      $('button[type=submit]').disabled = false;

      img.src = source.src;
      img.draggable = false;
      img.alt = 'Affidavit Preview';

      $('.preview_wrap').innerHTML = '';
      $('.preview_wrap').appendChild(img);
      $('.preview_container').style.display = 'block';
      $('#btnDownload').onclick = () => finishDownload(source.link, type);
    });
  }
  return false;
}