$('#current_lang').textContent = getStorage('lang', 'English');

(function() {

"use strict";

const affidavits = [
  {
    en: {
      title: "OBC Affidavit Form-Ⅷ",
      description: "Used to declare OBC non-creamy layer status for government of India, reservations, and official verification based on income and service criteria.",
      route: "FormVIII",
      icon: 'Ⅷ'
    },
    hi: {
      title: "शपथ पत्र फॉर्म-Ⅷ",
      description: "इसका उपयोग भारत सरकार द्वारा निर्धारित आरक्षण और आय एवं सेवा मानदंडों के आधार पर आधिकारिक सत्यापन के लिए ओबीसी OBC (अन्य पिछड़ा वर्ग) के गैर-क्रीमी स्तर की स्थिति घोषित करने के लिए किया जाता है।",
      route: "FormVIII",
      icon: 'Ⅷ'
    },
    ur: {
      title: "Ⅷ-حلف نامہ فارم",
      description: "حکومت ہند کے لیے OBC نان کریمی لیئر کی حیثیت کا اعلان کرنے کے لیے استعمال کیا جاتا ہے، تحفظات، اور آمدنی اور سروس کے معیار کی بنیاد پر سرکاری تصدیق۔",
      route: "FormVIII",
      icon: 'Ⅷ'
    }
  },
  {
    en: {
      title: "NCL Affidavit Form-Ⅺ",
      description: "Used for applying NCL certificate for government of Bihar, confirming caste eligibility and income criteria for reservation.",
      route: "FormXI",
      icon: 'Ⅺ'
    },
    hi: {
      title: "शपथ पत्र फॉर्म-Ⅺ",
      description: "इसका उपयोग बिहार सरकार के लिए एनसीएल (NCL) प्रमाणपत्र हेतु आवेदन करने, आरक्षण के लिए जातिगत पात्रता और आय मानदंडों की पुष्टि करने के लिए किया जाता है।",
      route: "FormXI",
      icon: 'Ⅺ'
    },
    ur: {
      title: "Ⅺ-حلف نامہ فارم",
      description: "حکومت بہار کے لیے NCL سرٹیفکیٹ کو لاگو کرنے، ذات کی اہلیت اور ریزرویشن کے لیے آمدنی کے معیار کی تصدیق کے لیے استعمال کیا جاتا ہے۔",
      route: "FormXI",
      icon: 'Ⅺ'
    }
  },
  {
    en: {
      title: "Income Certificate Affidavit Form-ⅩⅦ",
      description: "Used for applying income certificate government of Bihar, Block level issuing by Revenue officer.",
      route: "FormXVII",
      icon: 'ⅩⅦ'
    },
    hi: {
      title: "शपथ पत्र फॉर्म-ⅩⅦ",
      description: "बिहार सरकार द्वारा जारी आय प्रमाण पत्र के लिए आवेदन करने हेतु प्रयुक्त। यह प्रमाण पत्र ब्लॉक स्तर पर राजस्व अधिकारी द्वारा जारी किया जाता है।",
      route: "FormXVII",
      icon: 'ⅩⅦ'
    },
    ur: {
      title: "ⅩⅦ-حلف نامہ فارم",
      description: "انکم سرٹیفکیٹ آف بہار کی حکومت کو لاگو کرنے کے لیے استعمال کیا جاتا ہے، ریونیو افسر کے ذریعہ جاری کردہ بلاک سطح۔",
      route: "FormXVII",
      icon: 'ⅩⅦ'
    }
  },
  {
    en: {
      title: "Affidavit Bhumi Parimarjan Form-ⅩⅣ",
      description: "Used for correcting land record details online, including jamabandi errors, ownership claims, and verification for revenue department processing.",
      route: "FormXIV",
      icon: 'ⅩⅣ'
    },
    hi: {
      title: "शपथ पत्र भूमि परिमरजन फॉर्म-ⅩⅣ",
      description: "इसका उपयोग भूमि अभिलेखों के विवरण को ऑनलाइन सही करने के लिए किया जाता है, जिसमें जमाबंदी की त्रुटियां, स्वामित्व संबंधी दावे और राजस्व विभाग की प्रक्रियाओं के लिए सत्यापन शामिल हैं।",
      route: "FormXIV",
      icon: 'ⅩⅣ'
    },
    ur: {
      title: "حلف نامہ بھومی پرمارجن",
      description: "زمین کے ریکارڈ کی تفصیلات آن لائن درست کرنے کے لیے استعمال کیا جاتا ہے، بشمول جمع بندی کی غلطیاں، ملکیت کے دعوے، اور ریونیو ڈیپارٹمنٹ کی کارروائی کے لیے تصدیق۔",
      route: "FormXIV",
      icon: 'ⅩⅣ'
    }
  },
  {
    en: {
      title: "Affidavit Bhumi Digitization Form-Ⅻ",
      description: "Used for digitization land record details online, user can be see land details online and pay bhulagan tax online, and verification for revenue department processing.",
      route: "FormXII",
      icon: 'Ⅻ'
    },
    hi: {
      title: "शपथ पत्र भूमि डिजिटलीकरण फॉर्म-Ⅻ",
      description: "इसका उपयोग भूमि अभिलेखों के विवरण को ऑनलाइन डिजिटाइज़ करने के लिए किया जाता है, उपयोगकर्ता भूमि विवरण ऑनलाइन देख सकते हैं और भुलगान कर का ऑनलाइन भुगतान कर सकते हैं, साथ ही राजस्व विभाग द्वारा सत्यापन प्रक्रिया भी की जा सकती है।",
      route: "FormXII",
      icon: 'Ⅻ'
    },
    ur: {
      title: "حلف نامہ بھومی ڈیجیٹلائزیشن",
      description: "ڈیجیٹائزیشن لینڈ ریکارڈ کی تفصیلات آن لائن کے لیے استعمال کیا جاتا ہے، صارف زمین کی تفصیلات آن لائن دیکھ سکتا ہے اور بھولگن ٹیکس آن لائن ادا کر سکتا ہے، اور ریونیو ڈیپارٹمنٹ پروسیسنگ کے لیے تصدیق کر سکتا ہے۔",
      route: "FormXII",
      icon: 'Ⅻ'
    }
  }
];

const dashboardLabel = {
  en: "eAffidavit",
  hi: "ई-शपथ पत्र",
  ur: "حلف نامہ"
};

function dashboard() {
  addClass($('#activated_link'), 'hide');
  $('.content').innerHTML = '';
  let lang = getStorage('langId', 'en');
  let src;

  let secondryHeader = document.createElement('span');
  let services = document.createElement('div');

  addClass(secondryHeader, 'secondry_header');
  addClass(services, 'services');
  $('.content').appendChild(secondryHeader);
  $('.content').appendChild(services);

  $('#dsb').textContent = dashboardLabel[lang];

  $('.secondry_header').innerHTML = '<div class="services__section-title p-section-title">Services</div><div style="padding:0 0 16px;margin-bottom:11px;">Following bouquet of online Affidavit services are available for access. Click on the tab to navigate to the service-specific page.</div>';

  let j = 0;
  let poses = [36,40,34,36,37];

  for(src of affidavits) {
    let data = src[lang.substr(0, 2).toLowerCase()];
    let pos = poses[j];

    $('.services').innerHTML += `<div class="service_card" onclick="route('${data.route}', '${data.title}')"><div class="card-info"><div class="service-card_logo"><img src="assets/affidavit.svg" alt="${data.title}" draggable="false"><span class="icon" style="left:${pos}px">${data.icon}</span></div><div class="service-card__label">${data.title}</div><div class="service-card_desc">${data.description}</div></div><div class="service-card__arrow-icon"><img src="assets/arrow.svg" alt="Arrow Icon" draggable="false"></div></div>`;
    j++;
  }
}

window.dashboard = dashboard;
dashboard();

})();