import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';
import * as _mailgun from 'mailgun-js';
const mailgun_domain = "practicalbehavior.com";
const mailgun_key = "key-98d8bfc43a977f6b68dc9806a743b3c0";



const createPDF = (req, res, next) => {
    const doc = new PDFDocument;

    //#region FORM VARIABLES
    // All form fields are assigned variables here EXCEPT for DIDD, which is not necessary for PDF only for form front end jQuery validation
    let referralDate = new Date().toString();
    referralDate = referralDate.substring(0, 16);
    const referral = req.body.referral;
    //#endregion

    //#region PDF CONFIG
    const dir = 'private';
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    const fileName = `./${dir}/${new Date().toISOString()}.pdf`;
    var writeStream = fs.createWriteStream(fileName);

    writeStream.on("finish", function() {
        var file = fs.readFileSync(fileName);
        
        var mailgun = new _mailgun({apiKey: mailgun_key, domain: mailgun_domain});

        var attch = new mailgun.Attachment({
          data: file,
          filename: fileName,
          contentType: "application/pdf"
        });

        var data = {
          from: "office@practicalbehavior.com",
          // to: "zstevens@practicalbehavior.com",
          to: 'benjlur@me.com',
          subject: "New Referral",
          text: "New Referral",
          attachment: attch
        };
  
        mailgun.messages().send(data, function(error, body) {
          console.log("ERROR" + error);
          console.log("BODY" + JSON.stringify(body));
          fs.unlink(fileName, (err) => {
            console.error(err);
          })
        });
      });

    doc.pipe(writeStream);

    doc.registerFont('Montserrat', './src/assets/fonts/Montserrat-Regular.ttf');
    doc.registerFont('Montserrat-Bold', './src/assets/fonts/Montserrat-Bold.ttf');
    //#endregion

    // #region HEADER
    doc.image('./src/assets/images/PBA-PDF-logo.png', 50, 35, { width: 100 });

    doc.font('Montserrat').fontSize(8).text("Phone: (615) 669-6397", 415, 35);
    doc.font('Montserrat').fontSize(8).text("Fax: (615) 915-2663", 415, 50);
    doc.font('Montserrat-Bold').fontSize(8).text(`Date: ${referralDate}`, 415, 65);

    doc.font('Montserrat-Bold').fontSize(11).text("Referral For Behavior Analysis Services", 200, 90);
    // #endregion

    //#region DRAW BOX 1
    doc.lineWidth(0.5);

    doc
      .moveTo(50, 120)
      // 1. Create box (args: .rect(x, y, width, height))
      // Dimensions of box: 500 BY 60 -- rows are 15y each -- last row height * 2
      .rect(50, 120, 500, 75)

      // 2. Draw Rows in Box
      .moveTo(50, 135)
      .lineTo(550, 135)
      .moveTo(50, 150)
      .lineTo(550, 150)
      .moveTo(50, 165)
      .lineTo(550, 165)

      // 3. Draw line through top 2 rows
      .moveTo(315, 120)
      .lineTo(315, 165)
      .stroke();
    //#endregion

    //#region FILL VALUES BOX 1
    // Style guide for text in rows: margin-left: 5 px, margin-top 3.5, font-size: 11 . This styling is for the BEGINNING of the field names
    // If the field are entered into the PDF withOUT if/else conditional logic, it is because they are mandatory form fields (see validate.js jQuery file)
    // If the fields are entered into the PDF WITH if/else conditional logic, it is because they are optional

    doc.font('Montserrat').fontSize(8).text(`Individual’s Name: ${referral.patient.name}`, 55, 123.5);
    doc.font('Montserrat').fontSize(8).text(`E-Mail: ${referral.patient.email}`, 320, 123.5);
    doc.font('Montserrat').fontSize(8).text(`Date of Birth: ${referral.patient.dob}`, 55, 138.5);
    doc.font('Montserrat').fontSize(8).text(`Street/Apt: ${referral.patient.address} ${referral.patient.address2 ? ', ' + referral.patient.address2 : ''}`, 320, 138.5);
    doc.font('Montserrat').fontSize(8).text(`Phone: ${referral.patient.phone}`, 55, 153.5);
    doc.font('Montserrat').fontSize(8).text(`City/State/Zip: ${referral.patient.city}, ${referral.patient.state}, ${referral.patient.zip}`, 320, 153.5);
    doc.font('Montserrat').fontSize(8).text(`Diagnosis: ${referral.patient.diagnosis ? referral.patient.diagnosis : ''}`, 55, 168.5);
  
    //#endregion

    //#region DRAW BOX 2
    doc
    .moveTo(50, 210)

    // 1. Create box; args: .rect(x, y, width, height)
    .rect(50, 210, 500, 60)

    // 2. Create rows in box
    .moveTo(50, 225)
    .lineTo(550, 225)
    .moveTo(50, 240)
    .lineTo(550, 240)
    .moveTo(50, 255)
    .lineTo(550, 255)

    // 3. Draw line through middle - bottom 2 rows
    .moveTo(315, 225)
    .lineTo(315, 270)

    .stroke();
    //#endregion

    //#region FILL VALUES BOX 2
    // form rules for guardianName and guardianNotApplicable make it so EITHER one or the other will be present. The code below reflects this fact.
    doc.fontSize(8).text(`Conservator/Guardian: ${referral.guardian.name || 'N/A'}`, 55, 212.5);
    doc.fontSize(8).text(`Street/Apt: ${referral.guardian.address || 'N/A'} ${referral.guardian.address2 ? ', ' + referral.guardian.address2 : ''}`, 55, 228.5);
    doc.fontSize(8).text(`City/State/Zip: ${referral.guardian.city || ''}, ${referral.guardian.state  || ''}, ${referral.guardian.zip  || ''}`, 320, 228.5);
    doc.fontSize(8).text(`Phone: ${referral.guardian.phone  || ''}`, 55, 243.5);
    doc.fontSize(8).text(`E-Mail: ${referral.guardian.email  || ''}`, 320, 243.5);
    doc.fontSize(8).text(`Preferred Method of Contact:  _${referral.guardian.preferredPhone ? 'X' : '_'}_PHONE  _${referral.guardian.preferredEmail ? 'X' : '_'}_EMAIL`, 55, 258.5);
    doc.fontSize(8).text(`Preferred Time of Contact:  _${referral.guardian.preferredAM ? 'X' : '_'}_AM  _${referral.guardian.preferredPM ? 'X' : '_'}_PM`, 320, 258.5);
    //#endregion
    
    //#region DRAW BOX 3
    doc
      .moveTo(50, 300)

      // 1. Create box; This one has only 3 rows, so the height of this rectangle is 45
      .rect(50, 300, 500, 45)

      // 2. Create rows in box
      .moveTo(50, 315)
      .lineTo(550, 315)
      .moveTo(50, 330)
      .lineTo(550, 330)

      // 3. create line through middle row only
      .moveTo(315, 315)
      .lineTo(315, 330)
      .stroke();

      //#endregion

    //#region FILL VALUES BOX 3
    doc.fontSize(8).text(`Person Filling Out Form (if different from above): ${referral.otherPerson.name ? referral.otherPerson.name : ''}`, 55, 303.5);
    doc.fontSize(8).text(`Phone: ${referral.otherPerson.phone ? referral.otherPerson.phone : ''}`, 55, 318.5);      
    doc.fontSize(8).text(`Fax: ${referral.otherPerson.fax ? referral.otherPerson.fax : ''}`, 320, 318.5);
    doc.fontSize(8).text(`Email: ${referral.otherPerson.email ? referral.otherPerson.email : ''}`, 55, 333.5);  
    //#endregion

    //#region DRAW BOX 4
    doc
    .moveTo(50, 375)

    // 1. Create Box; This rectangle will be 500 by 30 - only two 15px rows
    .rect(50, 360, 500, 30)

    // .lineTo(500, 375)
    // .lineTo(500, 405)
    // .lineTo(100, 405)
    // .lineTo(100, 375)

    // 2. Create rows -- 2
    .moveTo(50, 375)
    .lineTo(550, 375)

    // 3. Line down middle
    .moveTo(315, 360)
    .lineTo(315, 375)
    .stroke();
    //#endregion

    //#region FILL VALUES BOX 4
    // The form rule for insurance and DIDD make it so one or the other will be present. The code below reflects this fact
    doc.fontSize(8).text(`Insurance: ${referral.insurance.name ? referral.insurance.name : referral.insurance.nameOther ? referral.insurance.nameOther : 'DIDD'}`, 55, 363.5);
    doc.fontSize(8).text(`Insurance #: ${referral.insurance.number ? referral.insurance.number : ''}`, 320, 363.5);
    doc.fontSize(8).text(`Insurance (Other): ${referral.insurance.nameOther ? referral.insurance.nameOther : ''}`, 55, 378.5);
    //#endregion
    
    //#region PREVIOUS TREATMENT
    doc
      .fontSize(9)
      .text(
        `Previous treatments for behavior issues:`,
        50,
        400);

    doc
      .fontSize(9)
      .text(
        `_${referral.previousTreatmentBoxes.speechTherapy ? 'Y': '_'}_ Speech Therapy`,
      50,
      415);

    doc
      .fontSize(9)
      .text(
        `_${referral.previousTreatmentBoxes.occupationalTherapy ? 'Y': '_'}_ Occupational Therapy`,
      350,
      415);

    doc
      .fontSize(9)
      .text(
        `_${referral.previousTreatmentBoxes.aba ? 'Y': '_'}_ ABA`,
      50,
      430);

    doc
      .fontSize(9)
      .text(
        `_${referral.previousTreatmentBoxes.informalTreatment ? 'Y': '_'}_ Informal Treatment`,
      350,
      430);
    
    doc
      .fontSize(9)
      .text(
        `_${referral.previousTreatmentBoxes.medication ? 'Y': '_'}_ Medication`,
      50,
      445);
        
    doc
      .fontSize(9)
      .text(
        `_${referral.previousTreatmentBoxes.otherTreatmentCheckbox ? 'Y': '_'}_ Other`,
      350,
      445);

    if (referral.previousTreatmentBoxes.otherTreatmentCheckbox) {
      doc
        .fontSize(9)
        .text(
          `Description of Previous Treatment: ${referral.previousTreatmentBoxes.otherTreatment}`,
        50,
        460);
    }

    //#endregion

    //#region BEHAVIOR OF CONCERN
    doc.fontSize(9).text("Behaviors of Concern:", 50, 505);

    doc
      .fontSize(9)
      .text(
        `_${referral.behaviorBoxes.physicalAggression ? 'Y' : '_'}_ Physical Aggression (Harming, or attempting to harm, another individual)`,
        50,
        520);

      doc
        .fontSize(9)
        .text(
          `_${referral.behaviorBoxes.selfInjurious ? 'Y' : '_'}_ Self-Injurious Behaviors (Harming, or attempting to harm, self)`,
          50,
          535
        );
    
      doc
        .fontSize(9)
        .text(
          `_${referral.behaviorBoxes.propertyDestruction ? 'Y' : '_'}_ Property Destruction (Destroying, or attempting to destroy, property)`,
          50,
          550);

    
      doc
        .fontSize(9)
        .text(
          `_${referral.behaviorBoxes.elopement ? 'Y' : '_'}_ Elopement (Leaving, or attempting to leave, the supervised area)`,
          50,
          565);

    
      doc
        .fontSize(9)
        .text(
          `_${referral.behaviorBoxes.PICA ? 'Y' : '_'}_ PICA (Ingesting, or attempting to ingest, inedible objects)`,
          50,
          580);
    
      doc
        .fontSize(9)
        .text(
          `_${referral.behaviorBoxes.tantrum ? 'Y' : '_'}_ Tantrum (Crying, screaming, yelling, throwing things, or falling to the floor)`,
          50,
          595
        );

      doc
        .fontSize(9)
        .text(
          `_${referral.behaviorBoxes.verbalAggression ? 'Y' : '_'}_ Verbal Aggression (Yelling, screaming, or cursing at another individual)`,
          50,
          610
        );

      doc
        .fontSize(9)
        .text(
          `_${referral.behaviorBoxes.noncompliance ? 'Y' : '_'}_ Noncompliance (Not complying with necessary instructions provided by a caregiver)`,
          50,
          625
        );

      doc.fontSize(9).text(`_${referral.behaviorBoxes.otherCheckbox ? 'Y' : '_'}_ Other (please be specific):`, 50, 640);
      doc.fontSize(8).text(`${referral.behaviorBoxes.other ? referral.behaviorBoxes.other : ''}`, 50, 655);

      doc
        .fontSize(9)
        .text(
          `Description of the behaviors, including frequency (daily, weekly, monthly) and intensity (severe, moderate, minor): ${referral.behaviorsDescription ? referral.behaviorsDescription : ''}`,
          50,
          675
        );
      //#endregion

    doc.end();
    res.pdfPath = fileName;
    next();
}

export default createPDF;