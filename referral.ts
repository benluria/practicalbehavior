import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';


const createPDF = (req, res, next) => {
    const doc = new PDFDocument;

    //#region FORM VARIABLES
    // All form fields are assigned variables here EXCEPT for DIDD, which is not necessary for PDF only for form front end jQuery validation
    let referralDate = new Date().toString();
    referralDate = referralDate.substring(0, 16);

    const patientName = req.body.patientName;
    const patientDOB = req.body.patientDOB;
    const patientAddress = req.body.patientAddress;
    const patientPhone = req.body.patientPhone;
    const cityZip = req.body.cityZip;
    const diagnosis = req.body.diagnosis;
    const guardianName = req.body.guardianName;
    const guardianAddress = req.body.guardianAddress;
    const guardianPhone = req.body.guardianPhone;
    const guardianEmail = req.body.guardianEmail;
    const preferredEmail = req.body.preferredEmail;
    const preferredPhone = req.body.preferredPhone;
    const preferredAM = req.body.preferredAM;
    const preferredPM = req.body.preferredPM;
    const personFillingOut = req.body.personFillingOut;
    const personFillingPhone = req.body.personFillingPhone;
    const personFillingEmail = req.body.personFillingEmail;
    const personFillingFax = req.body.personFillingFax;
    const insuranceName = req.body.insuranceName;
    const insuranceNumber = req.body.insuranceNumber;
    const PCP = req.body.PCP;
    const PCPPhone = req.body.PCPPhone;
    const previousTreatment = req.body.previousTreatment;
    const behaviorsDescription = req.body.behaviorsDescription;
    const physicalAggression = req.body.physicalAggression;
    const selfInjurious = req.body.selfInjurious;
    const propertyDestruction = req.body.propertyDestruction;
    const elopement = req.body.elopement;
    const PICA = req.body.PICA;
    const tantrum = req.body.tantrum;
    const verbalAggression = req.body.verbalAggression;
    const noncompliance = req.body.noncompliance;
    const otherCheckbox = req.body.otherCheckbox;
    const other = req.body.other;
    const guardianNotApplicable = req.body.guardianNotApplicable;
    //#endregion

    //#region PDF CONFIG
    const dir = 'private';
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    const fileName = `./${dir}/${new Date().toISOString()}.pdf`;
    var writeStream = fs.createWriteStream(fileName);

    writeStream.on("finish", function() {
        // var file = fs.readFileSync(fileName);
        
        // var attch = new mailgun.Attachment({
        //   data: file,
        //   filename: filename,
        //   contentType: "application/pdf"
        // });
        // var data = {
        //   from: "office@practicalbehavior.com",
        //   to: "zstevens@practicalbehavior.com",
        //   subject: "New Referral",
        //   text: "New Referral",
        //   attachment: attch
        // };
  
        // mailgun.messages().send(data, function(error, body) {
        //   console.log("ERROR" + error);
        //   console.log("BODY" + JSON.stringify(body));
        // });
      });

    doc.pipe(writeStream);

    doc.registerFont('Montserrat', './src/assets/fonts/Montserrat-Regular.ttf');
    //#endregion

    // #region HEADER
    doc.image('./src/assets/images/PBA-PDF-logo.png', 50, 35, { width: 100 });

    doc.font('Montserrat').fontSize(11).text("Phone: (615) 669-6397", 415, 35);
    doc.font('Montserrat').fontSize(11).text("Fax: (615) 915-2663", 415, 50);

    doc.font('Montserrat').fontSize(14).text("Referral For Behavior Analysis Services", 170, 90);
    // #endregion

    //#region DRAW BOX
    doc
      .moveTo(50, 120)
      // 1. Create box (args: .rect(x, y, width, height))
      // Dimensions of box: 500 BY 60 -- rows are 15y each
      .rect(50, 120, 500, 80)

      // 2. Draw Rows in Box
      .moveTo(50, 140)
      .lineTo(550, 140)
      .moveTo(50, 160)
      .lineTo(550, 160)
      .moveTo(50, 180)
      .lineTo(550, 180)

      // 3. Draw line through top 2 rows
      .moveTo(315, 120)
      .lineTo(315, 160)
      .stroke();
    //#endregion

    //#region FILL VALUES
    // Style guide for text in rows: margin-left: 5 px, margin-top 3.5, font-size: 11 . This styling is for the BEGINNING of the field names
    // If the field are entered into the PDF withOUT if/else conditional logic, it is because they are mandatory form fields (see validate.js jQuery file)
    // If the fields are entered into the PDF WITH if/else conditional logic, it is because they are optional

    doc.fontSize(11).text(`Name: ${patientName}`, 55, 123.5);
    doc.fontSize(11).text(`Referral Date: ${referralDate}`, 320, 123.5);
    doc.fontSize(11).text(`Phone: ${patientPhone}`, 55, 143.5);
    doc.fontSize(11).text(`Date of Birth: ${patientDOB}`, 320, 143.5);

    if (patientAddress) {
        doc
          .fontSize(11)
          .text(`Street/City/Zip: ${patientAddress} , ${cityZip}`, 55, 163.5);
      } else {
        doc.fontSize(11).text(`Street/City/Zip: ${cityZip}`, 55, 163.5);
      }
  
      if (diagnosis) {
        doc.fontSize(11).text(`Diagnosis: ${diagnosis}`, 55, 183.5);
      } else {
        doc.fontSize(11).text(`Diagnosis: `, 55, 183.5);
      }
  
    //#endregion

    //#region DRAW BOX
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
    .moveTo(315, 240)
    .lineTo(315, 270)

    .stroke();
    //#endregion

    //#region FILL VALUES
    // form rules for guardianName and guardianNotApplicable make it so EITHER one or the other will be present. The code below reflects this fact.
    if (guardianNotApplicable) {
        doc.fontSize(11).text(`Conservator/Guardian: N/A`, 55, 213.5);
    } else {
        doc.fontSize(11).text(`Conservator/Guardian: ${guardianName}`, 55, 213.5);
    }

    if (guardianAddress) {
        doc.fontSize(11).text(`Street/City/Zip: ${guardianAddress}`, 55, 228.5);
    } else {
        doc.fontSize(11).text("Street/City/Zip: ", 55, 228.5);
    }

    if (guardianPhone) {
        doc.fontSize(11).text(`Phone: ${guardianPhone}`, 55, 243.5);
    } else {
        doc.fontSize(11).text("Phone: ", 55, 243.5);
    }

    if (guardianEmail) {
        doc.fontSize(11).text(`E-Mail: ${guardianEmail}`, 320, 243.5);
    } else {
        doc.fontSize(11).text(`E-Mail: ${guardianEmail}`, 320, 243.5);
    }

    if (preferredEmail === "on") {
        doc.fontSize(11).text("Preferred Method of Contact: EMAIL", 55, 258.5);
    } else if (preferredPhone === "on") {
        doc.fontSize(11).text("Preferred Method of Contact: PHONE", 55, 258.5);
    } else {
        doc.fontSize(11).text("Preferred Method of Contact: ", 55, 258.5);
    }

    if (preferredAM === "on") {
        doc.fontSize(11).text("Preferred Time of Contact: AM", 320, 258.5);
    } else if (preferredPM === "on") {
        doc.fontSize(11).text("Preferred Time of Contact: PM", 320, 258.5);
    } else {
        doc.fontSize(11).text("Preferred Time of Contact: ", 320, 258.5);
    }
    //#endregion
    
    //#region DRAW BOX
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

    //#region FILL VALUES
    if (personFillingOut) {
        doc
          .fontSize(11)
          .text(
            `Person Filling Out Form (if different from above): ${personFillingOut}`,
            55,
            303.5
          );
      } else {
        doc
          .fontSize(11)
          .text(
            "Person Filling Out Form (if different from above): N/A",
            55,
            303.5
          );
      }
  
      doc.fontSize(11).text(`Phone: ${personFillingPhone}`, 55, 318.5);
  
      if (personFillingFax) {
        doc.fontSize(11).text(`Fax: ${personFillingFax}`, 320, 318.5);
      } else {
        doc.fontSize(11).text("Fax:", 320, 318.5);
      }
  
      doc.fontSize(11).text(`Email: ${personFillingEmail}`, 55, 333.5);
    //#endregion

    //#region DRAW BOX
    doc
    .moveTo(50, 375)

    // 1. Create Box; This rectangle will be 500 by 30 - only two 15px rows
    .rect(50, 375, 500, 30)

    // .lineTo(500, 375)
    // .lineTo(500, 405)
    // .lineTo(100, 405)
    // .lineTo(100, 375)

    // 2. Create rows -- 2
    .moveTo(50, 390)
    .lineTo(550, 390)

    // 3. Line down middle
    .moveTo(315, 375)
    .lineTo(315, 405)
    .stroke();
    //#endregion

    //#region FILL VALUES
    // The form rule for insurance and DIDD make it so one or the other will be present. The code below reflects this fact
    if (insuranceName) {
        doc.fontSize(11).text(`Insurance: ${insuranceName}`, 55, 378.5);
    } else {
        doc.fontSize(11).text("Insurance: DIDD", 55, 378.5);
    }

    if (insuranceNumber) {
        doc.fontSize(11).text(`Insurance #: ${insuranceNumber}`, 320, 378.5);
    } else {
        doc.fontSize(11).text("Insurance #: ", 320, 378.5);
    }

    if (PCP) {
        doc.fontSize(11).text(`PCP: ${PCP}`, 55, 393.5);
    } else {
        doc.fontSize(11).text("PCP: ", 55, 393.5);
    }

    if (PCPPhone) {
        doc.fontSize(11).text(`PCP Phone: ${PCPPhone}`, 320, 393.5);
    } else {
        doc.fontSize(11).text(`PCP Phone: `, 320, 393.5);
    }
    //#endregion
    
    //#region PREVIOUS TREATMENT / BEHAVIORS OF CONCERN
    if (previousTreatment) {
        doc
          .fontSize(9)
          .text(
            `List previous treatments for behavior issues (Speech Therapy, Occupational Therapy, ABA, Informal behavior treatment, medication) and the overall effectiveness of other treatments: ${previousTreatment}`,
            50,
            430
          );
      } else {
        doc
          .fontSize(9)
          .text(
            "List previous treatments for behavior issues (Speech Therapy, Occupational Therapy, ABA, Informal behavior treatment, medication) and the overall effectiveness of other treatments: ",
            50,
            430
          );
      }
  
      doc.fontSize(9).text("Behaviors of Concern:", 50, 520);
  
      if (physicalAggression === "on") {
        doc
          .fontSize(9)
          .text(
            "_Y_ Physical Aggression (Any instance of harming, or attempting to harm, another individual)",
            50,
            535
          );
      } else {
        doc
          .fontSize(9)
          .text(
            "___ Physical Aggression	(Any instance of harming, or attempting to harm, another individual)",
            50,
            535
          );
      }
  
      if (selfInjurious === "on") {
        doc
          .fontSize(9)
          .text(
            "_Y_ Self-Injurious Behaviors (Any instance of harming, or attempting to harm, self)",
            50,
            550
          );
      } else {
        doc
          .fontSize(9)
          .text(
            "___ Self-Injurious Behaviors (Any instance of harming, or attempting to harm, self)",
            50,
            550
          );
      }
  
      if (propertyDestruction === "on") {
        doc
          .fontSize(9)
          .text(
            "_Y_ Property Destruction (Any instance of destroying, or attempting to destroy, property)",
            50,
            565
          );
      } else {
        doc
          .fontSize(9)
          .text(
            "___ Property Destruction (Any instance of destroying, or attempting to destroy, property)",
            50,
            565
          );
      }
  
      if (elopement === "on") {
        doc
          .fontSize(9)
          .text(
            "___ Elopement (Any instance of leaving, or attempting to leave, the supervised area)",
            50,
            580
          );
      } else {
        doc
          .fontSize(9)
          .text(
            "___ Elopement (Any instance of leaving, or attempting to leave, the supervised area)",
            50,
            580
          );
      }
  
      if (PICA === "on") {
        doc
          .fontSize(9)
          .text(
            "_Y_ PICA (Any instance of ingesting, or attempting to ingest, inedible objects)",
            50,
            595
          );
      } else {
        doc
          .fontSize(9)
          .text(
            "___ PICA (Any instance of ingesting, or attempting to ingest, inedible objects)",
            50,
            595
          );
      }
  
      if (tantrum === "on") {
        doc
          .fontSize(9)
          .text(
            "_Y_ Tantrum (Any instance of crying, screaming, yelling, throwing things, or falling to the floor)",
            50,
            610
          );
      } else {
        doc
          .fontSize(9)
          .text(
            "___ Tantrum (Any instance of crying, screaming, yelling, throwing things, or falling to the floor)",
            50,
            610
          );
      }
  
      if (verbalAggression === "on") {
        doc
          .fontSize(9)
          .text(
            "_Y_ Verbal Aggression (Any instance of yelling, screaming, or cursing at another individual)",
            50,
            625
          );
      } else {
        doc
          .fontSize(9)
          .text(
            "___ Verbal Aggression (Any instance of yelling, screaming, or cursing at another individual)",
            50,
            625
          );
      }
  
      if (noncompliance === "on") {
        doc
          .fontSize(9)
          .text(
            "_Y_ Noncompliance (Any instance of not complying with necessary instructions provided by a caregiver)",
            50,
            640
          );
      } else {
        doc
          .fontSize(9)
          .text(
            "___ Noncompliance (Any instance of not complying with necessary instructions provided by a caregiver)",
            50,
            640
          );
      }
  
      if (otherCheckbox === "on") {
        doc.fontSize(9).text("_Y_ Other (please be specific):", 50, 655);
        doc.moveDown();
        doc.fontSize(8).text(`${other}`);
      } else {
        doc.fontSize(9).text("___ Other (please be specific):", 50, 655);
      }
  
      if (behaviorsDescription) {
        doc
          .fontSize(9)
          .text(
            `Description of the behaviors, including frequency (daily, weekly, monthly) and intensity (severe, moderate, minor): ${behaviorsDescription}`,
            50,
            715
          );
      } else {
        doc
          .fontSize(9)
          .text(
            "Description of the behaviors, including frequency (daily, weekly, monthly) and intensity (severe, moderate, minor):",
            50,
            690
          );
      }
      //#endregion

    doc.end();
    res.pdfPath = fileName;
    next();
}

export default createPDF;