import allstudents from "../models/Allstudents.js";
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from "mongoose";
dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.env') });

 
export const AddNewStudents=async(req,res)=>{   

    const{RoomNumber,Sharing,StartingDate,AmountPerMonth,StudentName,Mobilenumber,PMobilenumber,Email,Address,CollegeName,CourseNameandYear,paymentstatus}=req.body;
     try {
        const isalreadyindb= await allstudents.findOne({Email:Email});
        if(isalreadyindb){
            return res.status(400).json({message:'Student already exists'});
        }
        const newstudent=new allstudents({
            RoomNumber,
            Sharing,
            StartingDate:new Date(StartingDate),
            AmountPerMonth,
            StudentName,
            Mobilenumber,
            Email,
            Address,
            CollegeName,
            CourseNameandYear,
            PMobilenumber,
            paymentstatus
        });

        await newstudent.save();
        res.status(201).json({message:'New Student Added Successfully',data:newstudent});
 
        

    } catch (error) {
        console.log('Error in adding new student:',error);
        return res.status(500).json({message:'Something went wrong:30',error:error.message});
    }
    
}

export const UpdateAllPaymentStatus=async(req,res)=>{
    try {
        console.log("🔄 Monthly payment reset started...");
    
        await mongoose.connect(process.env.MONGO_URI);
    
        const result = await allstudents.updateMany(
          { isActive: true, paymentstatus: "Paid" },
          { $set: { paymentstatus: "Unpaid" } }
        );
    
        console.log(`✅ Updated ${result.modifiedCount} students to Unpaid`);
        res.status(200).json({ message: 'All active students payment status updated to Unpaid' });
    
         console.log("✅ Monthly payment reset completed.");
      } catch (error) {
        console.error("❌ Cron job failed:", error);
        res.status(500).json({ message: 'Something went wrong during the payment status update', error: error.message });
      }
};