const express=require("express");
const nodemailer=require("nodemailer");
const cors=require("cors");
const app=express();
app.use(express.json());
app.use(cors());
let savedOTPs={};
app.post("/sendOTP",(req,res)=>{
    let email=req.body.email,name=req.body.name,otp="",i;
    for(i=0;i<4;i++)
    {
        otp+=Math.floor(Math.random()*10);
    }
    const transporter=nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:587,
        secure:false,
        auth:{
            user:"n.kiranbabu630@gmail.com",
            pass:"nyroaatuacoynhdb"
        }
    });
    const options={
        from:"n.kiranbabu630@gmail.com",
        to:`${email}`,
        subject:"donotreply",
        text:"Your One Time Password",
        html:`<h1>Dear ${name}</h1><br><p>Your One Time Password (OTP) is ${otp}</p><br><p>Note: This is a system generated email, please do not reply.</p>`
    }
    transporter.sendMail(options, (error, info) => {
        if (error) {
            console.error("Error sending OTP:", error);
            res.status(500).send("Unable to send OTP");
        } else {
            console.log("OTP sent successfully. Info:", info.response);
            savedOTPs[email] = otp;
            setTimeout(() => {
                delete savedOTPs[email];
            }, 120000);
            res.status(200).send("OTP sent successfully"); 
        }
    });
});
app.post("/verify",(req,res)=>{
    let email=req.body.email;
    let otpreceived=req.body.otp;
    console.log(email,otpreceived);
    if(savedOTPs[email]===otpreceived)
    {
        res.status(200).send("Verified.Valid OTP");
    }
    else
    {
        res.status(500).send("Invalid OTP");
    }
})
app.listen(6500,()=>{
    console.log("Server running on port http://localhost:6500");
});