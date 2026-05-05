function removeBg(signature, width, height) {
  let imageData, data, r, g, b, brightness,
    signCanvas = document.createElement('canvas'),
    ctx = signCanvas.getContext('2d'),
    i = 0;

  signCanvas.width = width;
  signCanvas.height = height;
  ctx.drawImage(signature, 0, 0);

  imageData = ctx.getImageData(0, 0, width, height);
  data = imageData.data;

  // Removing Background Make Transparent
  for(; i < data.length; i += 4) {
    r = data[i];
    g = data[i + 1];
    b = data[i + 2];

    brightness = (r + g + b) / 3;
    if (brightness > 180) {
      data[i + 3] = 0;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return signCanvas;
}

function addSignature(resolve, canvas, ctx, source, sign, SIGN_MAX_WIDTH, SIGN_MAX_HEIGHT, SIGN_X, SIGN_Y, Y, type, quality) {
  if (source instanceof File) {
    let signature = new Image;
    signature.src = URL.createObjectURL(source);

    signature.onload = function() {
      let natWidth = signature.naturalWidth;
      let natHeight = signature.naturalHeight;
      let XRatio = natHeight / natWidth;
      let YRatio = natWidth / natHeight;
      let width, height;

      if (natHeight > SIGN_MAX_HEIGHT) {
        height = SIGN_MAX_HEIGHT;
        width = height * YRatio;
      }
      else if (natWidth > SIGN_MAX_WIDTH) {
        width = SIGN_MAX_WIDTH;
        height = width * XRatio;
      } else {
        width = natWidth;
        height = natHeight;
      }

      SIGN_X += (SIGN_MAX_WIDTH - width) / 2;
      SIGN_Y += (SIGN_MAX_HEIGHT - height) / 2;

      ctx.drawImage(removeBg(signature, natWidth, natHeight), SIGN_X, SIGN_Y, width, height);
      XVII.prototype.download(canvas, resolve, type, quality);
    };
  } else {
    let MT = ctx.measureText(sign);
    let signatureWidth = MT.width;
    let signatureHeight = MT.fontBoundingBoxAscent + MT.fontBoundingBoxDescent;

    SIGN_X += (SIGN_MAX_WIDTH - signatureWidth) / 2;
    SIGN_Y += (SIGN_MAX_HEIGHT + signatureHeight) / 2;

    ctx.fillStyle = '#0f0ff1';
    ctx.fillText(sign, SIGN_X, SIGN_Y + Y);
    XVII.prototype.download(canvas, resolve, type, quality);
  }
}

/**
 * Form XVII (Affidavit) for Income certificate
 * 
 * Required Key
 * 1.  applicantName
 * 2.  fatherName
 * 3.  motherName
 * 4.  village
 * 5.  postOffice
 * 6.  policeStation
 * 7.  block
 * 8.  subDivision
 * 9.  dist
 * 10. state
 * 11. incomeFromGovt
 * 12. incomeFromBusiness
 * 13. incomeFromAgriculture
 * 14. incomeFromOther
 * 15. place
 * 16. signature
 */
(function(w) {

"use strict";

const pageW = 1349;
const pageH = 2078;

function XVII(options) {
  return new XVII.prototype.XVII(options || {});
}

XVII.prototype = {
  XVII: function(options) {
    this.applicantName = options.applicantName;
    this.fatherName = options.fatherName;
    this.motherName = options.motherName;
    
    this.village = options.village;
    this.postOffice = options.postOffice;
    this.policeStation = options.policeStation;
    this.block = options.block;
    this.subDivision = options.subDivision;
    this.dist = options.dist;
    this.state = options.state;

    this.incomeFromGovt = options.incomeFromGovt || '00';
    this.incomeFromBusiness = options.incomeFromBusiness || '00';
    this.incomeFromAgriculture = options.incomeFromAgriculture || '00';
    this.incomeFromOther = options.incomeFromOther || '00';
    this.totalIncome = (parseInt(this.incomeFromGovt) + parseInt(this.incomeFromBusiness) + parseInt(this.incomeFromAgriculture) + parseInt(this.incomeFromOther)).toLocaleString() + '/-';

    this.incomeFromGovt = this.incomeFromGovt.toLocaleString() + '/-';
    this.incomeFromBusiness = this.incomeFromBusiness.toLocaleString() + '/-';
    this.incomeFromAgriculture = this.incomeFromAgriculture.toLocaleString() + '/-';
    this.incomeFromOther = this.incomeFromOther.toLocaleString() + '/-';

    this.place = options.place || options.postOffice;
    this.date = this.currentDate();
    this.signature = options.signature;
    return new Promise((resolve, reject) => {
      this.generate(resolve, reject);
    });
  },
  currentDate: function() {
    let date = new Date;
    let day = date.getDate();
    let month = date.getMonth() + 1;
    month = month < 10 ? '0' + month : month;

    let dateParts = [day < 10 ? '0' + day : day, month, date.getFullYear()];
    return dateParts.join('/');
  },
  download: function(canvas, resolve, type, quality) {
    const link = document.createElement('a');

    canvas.toBlob(function(blob) {
      link.href = URL.createObjectURL(blob);

      if (type === 'VIII' || type === 'XI') {
        let newCanva = document.createElement('canvas'),
          ctx = newCanva.getContext('2d'),
          image = new Image;

        newCanva.width = 820;
        newCanva.height = 820 * (canvas.height / canvas.width);

        image.src = link.href;
        image.onload = function() {
          ctx.drawImage(image, 0, 0, newCanva.width, newCanva.height);
          link.href = newCanva.toDataURL('image/jpeg', .7);
          link.download = (type + '_') + (Date.now() + '.jpg');
          resolve({src: link.href, link, type});
        };
      } else {
        link.download = (type + '_') + (Date.now() + '.jpg');
        resolve({src: link.href, link, type});
      }
    }, 'image/jpeg', quality || 1);
  },
  generate: function(resolve) {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    let blueprint = new Image();
    let self = this;

    canvas.width = pageW;
    canvas.height = pageH;
    blueprint.src = 'affidavits/Form_XVII.jpeg';

    blueprint.onload = function() {
      ctx.font = '600 30px sans-serif';
      ctx.imageSmoothingQuality = 'high';
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(blueprint, 0, 0, pageW, pageH);

      ctx.fillText(self.applicantName, 150, 521);
      ctx.fillText(self.fatherName, 230, 596);
      ctx.fillText(self.motherName, 295, 673);
      ctx.fillText(self.village, 270, 745);
      ctx.fillText(self.postOffice, 915, 745);
      ctx.fillText(self.policeStation, 200, 814);
      ctx.fillText(self.block, 820, 814);
      ctx.fillText(self.subDivision, 260, 882);
      ctx.fillText(self.dist, 820, 882);
      ctx.fillText(self.state, 220, 955);
      ctx.fillText(self.incomeFromGovt, 420, 1030);
      ctx.fillText(self.incomeFromBusiness, 420, 1102);
      ctx.fillText(self.incomeFromAgriculture, 420, 1178);
      ctx.fillText(self.incomeFromOther, 420, 1252);
      ctx.fillText(self.totalIncome, 420, 1320);
      ctx.fillText(self.place, 230, 1920);
      ctx.fillText(self.date, 230, 1992);
       
      addSignature(resolve, canvas, ctx, self.signature, self.applicantName, 520, 90, 700, 1690, 10, 'XVII', .8);
    };
  }
};

XVII.prototype.XVII.prototype = XVII.prototype;
w.XVII = XVII;

})(window);

/**
 * Form XI (Affidavit) for NCL certificate
 * 
 * Required Key
 * 1.  applicantName
 * 2.  fatherName
 * 3.  motherName
 * 4.  village
 * 5.  postOffice
 * 7.  policeStation
 * 8.  block
 * 9.  subDivision
 * 10. dist
 * 11. state
 * 12. caste
 * 13. salaryIncome
 * 14. otherIncome
 * 15. place
 * 16. signature
 */
(function(win) {

const pageW = 1349;
const pageH = 1909;

function XI(options) {
  return new XI.prototype.XI(options || {});
}

XI.prototype = {
  XI: function(options) {
    this.applicantName = options.applicantName;
    this.fatherName = options.fatherName;
    this.motherName = options.motherName;
    this.caste = options.caste;
    
    this.village = options.village;
    this.postOffice = options.postOffice;
    this.policeStation = options.policeStation;
    this.block = options.block;
    this.subDivision = options.subDivision;
    this.dist = options.dist;
    this.state = options.state;

    this.salaryIncome = (options.salaryIncome || '00').toLocaleString() + '/-';
    this.otherIncome = (options.otherIncome || '00').toLocaleString() + '/-';

    this.place = options.place || options.postOffice;
    this.date = XVII.prototype.currentDate();
    this.signature = options.signature;
    return new Promise((resolve, reject) => {
      this.generate(resolve, reject);
    });
  },
  generate: function(resolve) {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    let blueprint = new Image();
    let self = this;

    canvas.width = pageW;
    canvas.height = pageH;
    blueprint.src = 'affidavits/Form_XI.jpg';

    blueprint.onload = function() {
      ctx.font = '600 24px sans-serif';
      ctx.imageSmoothingQuality = 'high';
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(blueprint, 0, 0, pageW, pageH);

      ctx.rotate(-2 * Math.PI / 180);
      ctx.fillText(self.applicantName, 212, 370);
      ctx.fillText(self.fatherName, 760, 370);
      ctx.fillText(self.village, 232, 414);
      ctx.fillText(self.postOffice, 690, 414);
      ctx.fillText(self.policeStation, 1000, 414);
      ctx.fillText(self.block, 170, 460);
      ctx.fillText(self.subDivision, 450, 460);
      ctx.fillText(self.dist, 685, 460);
      ctx.fillText(self.state, 900, 460);

      let maxCastWidth = 233;
      let castWidth = ctx.measureText(self.caste).width;

      if (castWidth > maxCastWidth) {
        ctx.font = '600 ' + (castWidth < 282 ? '20px' : '17px') + ' sans-serif';
      }

      ctx.fillText(self.caste, 240, 550);

      ctx.font = '600 24px sans-serif';
      ctx.fillText(self.salaryIncome, 750, 995);
      ctx.fillText(self.otherIncome, 150, 1086);
      ctx.fillText(self.place, 220, 1760);
      ctx.fillText(self.date, 220, 1802);
      
      addSignature(resolve, canvas, ctx, self.signature, self.applicantName, 500, 100, 680, 1580, 20, 'XI', 1);
    };
  }
};

XI.prototype.XI.prototype = XI.prototype;
win.XI = XI;

})(window);

/**
 * Form VIII (Affidavit) for OBC certificate
 * 
 * Required Key
 * 1.  applicantName
 * 2.  fatherName
 * 3.  motherName
 * 4.  village
 * 5.  postOffice
 * 7.  policeStation
 * 8.  block
 * 9.  subDivision
 * 10. dist
 * 11. state
 * 12. caste
 * 13. salaryIncome
 * 14. otherIncome
 * 15. place
 * 16. signature
 */
(function(win) {

const pageW = 1349;
const pageH = 1909;

function VIII(options) {
  return new VIII.prototype.VIII(options);
}

VIII.prototype = {
  VIII: function(options) {
    this.applicantName = options.applicantName;
    this.fatherName = options.fatherName;
    this.motherName = options.motherName;
    this.caste = options.caste;
    
    this.village = options.village;
    this.postOffice = options.postOffice;
    this.policeStation = options.policeStation;
    this.block = options.block;
    this.subDivision = options.subDivision;
    this.dist = options.dist;
    this.state = options.state;

    this.salaryIncome = (options.salaryIncome || '00').toLocaleString() + '/-';
    this.otherIncome = (options.otherIncome || '00').toLocaleString() + '/-';

    this.place = options.place || options.postOffice;
    this.date = XVII.prototype.currentDate();
    this.signature = options.signature;
    return new Promise((resolve, reject) => {
      this.generate(resolve, reject);
    });
  },
  generate: function(resolve) {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    let blueprint = new Image();
    let self = this;

    canvas.width = pageW;
    canvas.height = pageH;
    blueprint.src = 'affidavits/Form_VIII.jpg';

    blueprint.onload = function() {
      ctx.font = '600 30px sans-serif';
      ctx.imageSmoothingQuality = 'high';
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(blueprint, 0, 0, pageW, pageH);

      ctx.rotate(-1 * Math.PI / 180);
      ctx.fillText(self.applicantName, 212, 297);
      ctx.fillText(self.fatherName, 780, 297);
      ctx.fillText(self.village, 232, 341);
      ctx.fillText(self.postOffice, 710, 344);
      ctx.fillText(self.policeStation, 1040, 344);

      ctx.fillText(self.block, 170, 390);
      ctx.fillText(self.subDivision, 450, 388);
      ctx.fillText(self.dist, 685, 387);
      ctx.fillText(self.state, 910, 387);

      let maxCastWidth = 240;
      let castWidth = ctx.measureText(self.caste).width;

      if (castWidth > maxCastWidth) {
        ctx.font = '600 ' + (castWidth < 265 ? '27px' : (castWidth < 317 ? '22px' : '16px')) + ' sans-serif';
      }

      ctx.fillText(self.caste, 250, 485);

      ctx.font = '600 30px sans-serif';
      ctx.fillText(self.salaryIncome, 770, 947);
      ctx.fillText(self.otherIncome, 140, 1042);

      ctx.fillText(self.place, 220, 1703);
      ctx.fillText(self.date, 220, 1747);

      addSignature(resolve, canvas, ctx, self.signature, self.applicantName, 520, 90, 700, 1530, 15, 'VIII', 0.5);
    };
  }
}

VIII.prototype.VIII.prototype = VIII.prototype;
win.VIII = VIII;

})(window);

/**
 * Form XIV (Affidavit) for Bhumi Parimarjan
 * 
 * Required Key
 * 1.  applicantName
 * 2.  fatherName
 * 3.  mouza
 * 4.  psNo
 * 5.  halka
 * 6.  block
 * 7.  dist
 * 8.  volumeNo    (optional)
 * 9.  pageNo      (optional)
 * 10. jamabandiNo (optional)
 * 11. number
 * 12. signature
 */
(function(win) {

const pageW = 1349;
const pageH = 1908;

function XIV(options) {
  return new XIV.prototype.XIV(options);
}

XIV.prototype = {
  XIV: function(options) {
    this.applicantName = options.applicantName;
    this.fatherName = options.fatherName;
    this.mouza = options.mouza;
    this.psNo = options.psNo;
    this.halka = options.halka;
    this.block = options.block;
    this.dist = options.dist;
    this.volumeNo = options.volumeNo;
    this.pageNo = options.pageNo;
    this.jamabandiNo = options.jamabandiNo;
    this.number = options.number;
    this.signature = options.signature;

    // Jamabandi Details
    this.j_dist = options.j_dist;
    this.j_block = options.j_block;
    this.j_halka = options.j_halka;
    this.j_mouza = options.j_mouza;
    this.j_psNo = options.j_psNo;

    return new Promise((resolve, reject) => {
      this.generate(resolve, reject);
    });
  },
  generate: function(resolve) {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    let blueprint = new Image();
    let self = this;

    canvas.width = pageW;
    canvas.height = pageH;
    blueprint.src = 'affidavits/Form_XIV.jpg';

    blueprint.onload = function() {
      ctx.font = '600 23px sans-serif';
      ctx.imageSmoothingQuality = 'high';
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(blueprint, 0, 0, pageW, pageH);

      ctx.fillText(self.applicantName, 290, 235);
      ctx.fillText(self.fatherName, 870, 235);
      ctx.fillText(self.mouza, 250, 282);
      ctx.fillText(self.psNo, 615, 282);
      ctx.fillText(self.halka, 770, 282);
      ctx.fillText(self.block, 1060, 282);
      ctx.fillText(self.dist, 250, 328);

      // Jamabandi Details
      ctx.fillText(self.j_dist, 1000, 374);
      ctx.fillText(self.j_block, 250, 420);
      ctx.fillText(self.j_halka, 475, 420);
      ctx.fillText(self.j_mouza, 760, 420);
      ctx.fillText(self.j_psNo, 1111, 420);

      ctx.fillText(self.volumeNo || '', 380, 467);
      ctx.fillText(self.pageNo || '', 640, 467);
      ctx.fillText(self.jamabandiNo || '', 915, 467);

      ctx.font = '600 20px sans-serif';
      ctx.fillText('+91 '+self.number, 920, 1090);
      addSignature(resolve, canvas, ctx, self.signature, self.applicantName, 365, 75, 815, 1100, 0, 'XIV', 1);
    };
  }
};

XIV.prototype.XIV.prototype = XIV.prototype;
win.XIV = XIV;

})(window);

/**
 * Form XII (Affidavit) for Bhumi Dizitiazation
 * 
 * Required Key
 * 1.  applicantName
 * 2.  fatherName
 * 3.  mouza
 * 4.  psNo
 * 5.  halka
 * 6.  block
 * 7.  dist
 * 8.  volumeNo    (optional)
 * 9.  pageNo      (optional)
 * 10. jamabandiNo (optional)
 * 11. number
 * 12. signature
 */
(function(win) {

const pageW = 1349;
const pageH = 1908;

function XII(options) {
  return new XII.prototype.XII(options);
}

XII.prototype = {
  XII: function(options) {
    this.applicantName = options.applicantName;
    this.fatherName = options.fatherName;
    this.mouza = options.mouza;
    this.psNo = options.psNo;
    this.halka = options.halka;
    this.block = options.block;
    this.dist = options.dist;
    this.volumeNo = options.volumeNo;
    this.pageNo = options.pageNo;
    this.jamabandiNo = options.jamabandiNo;
    this.number = options.number;
    this.signature = options.signature;

    // Jamabandi Details
    this.j_dist = options.j_dist;
    this.j_block = options.j_block;
    this.j_halka = options.j_halka;
    this.j_mouza = options.j_mouza;
    this.j_psNo = options.j_psNo;

    return new Promise((resolve, reject) => {
      this.generate(resolve, reject);
    });
  },
  generate: function(resolve) {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    let blueprint = new Image();
    let self = this;

    canvas.width = pageW;
    canvas.height = pageH;
    blueprint.src = 'affidavits/Form_XII.jpg';

    blueprint.onload = function() {
      ctx.font = '600 23px sans-serif';
      ctx.imageSmoothingQuality = 'high';
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(blueprint, 0, 0, pageW, pageH);

      ctx.fillText(self.applicantName, 290, 174);
      ctx.fillText(self.fatherName, 900, 174);

      ctx.fillText(self.mouza, 250, 221);
      ctx.fillText(self.psNo, 720, 221);
      ctx.fillText(self.halka, 1060, 221);
      ctx.fillText(self.block, 250, 268);
      ctx.fillText(self.dist, 620, 268);

      // Jamabandi Details
      ctx.fillText(self.j_dist, 1055, 316);
      ctx.fillText(self.j_block, 250, 363);
      ctx.fillText(self.j_halka, 550, 363);
      ctx.fillText(self.j_mouza, 850, 363);
      ctx.fillText(self.j_psNo, 1161, 363);

      ctx.fillText(self.volumeNo || '', 550, 410);
      ctx.fillText(self.pageNo || '', 840, 410);
      ctx.fillText(self.jamabandiNo || '', 1135, 410);

      ctx.fillText(self.applicantName, 850, 837);
      ctx.fillText('+91 '+self.number, 850, 933);
      addSignature(resolve, canvas, ctx, self.signature, self.applicantName, 310, 90, 800, 975, -8, 'XII', 1);
    };
  }
};

XII.prototype.XII.prototype = XII.prototype;
win.XII = XII;

})(window);