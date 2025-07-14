// backend/models/userModel.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
     
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address',
      ],
    },
    department: {
      type: String,
      required: true,
      enum:  [
  "Engineering Services",
  "Workshop",
  "Glass",
  "Production 3",
  "Operations",
  "Warehouse",
  "Quality 3",
  "Quality",
  "Production 4",
  "Stores",
  "Design",
  "Accounts",
  "I S Maintenance",
  "IT",
  "MRS",
  "Foundry",
  "Administration",
  "Quality 4",
  "PPC & NPD",
  "Improvement Cell",
  "Human Resources",
  "Exports",
  "Purchase",
  "Logistics",
  "Sales",
  "Costing & MIS",
  "Safety"
], // update as per your dropdown options
    },
    employeeCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    designation: {
      type: String,
      required: true,
      enum: [
  "Sr. Electrician",
  "Assistant Manager",
  "Asst. Manager",
  "Sr. Supervisor",
  "Officer",
  "Sr. Officer",
  "Jr. Officer",
  "Jr. Supervisor",
  "Sr. Assistant",
  "Operator",
  "Deputy Manager",
  "Supervisor",
  "Asst Manager",
  "Sr.Technician",
  "Assistant",
  "C.N.C Operator",
  "Technical Assistant",
  "Lab Assistant",
  "Trainee",
  "Timekeeper",
  "Manager",
  "Worker Trainee",
  "Senior Manager - (Electrical)",
  "General Manager-Group Engg Head",
  "Asst General Manager",
  "Timekeepar",
  "Asst Mgr",
  "Senior Manager",
  "Executive",
  "General Manager",
  "Asst.Supervisor",
  "Sr.Exective",
  "Sr Manager",
  "Sr.Executive",
  "Asst Operator",
  "Sr Executive",
  "Sr. Manager",
  "GET",
  "Time Keeper Trainee",
  "Shift Supervisor",
  "CNC Supervisor",
  "Jr.Supervisor",
  "Jr. Executive",
  "Mentor",
  "DGM",
  "Management Trainee",
  "Technician"
]
, // predefined roles
    },
    companyRole: {
      type: String,
      trim: true,
    },
    dateOfJoining: {
      type: Date,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      trim: true,
    },


    permanentAddress
      : {
      type: String,
      
      trim: true,
    },
    presentAddress: {
      type: String,
    
      trim: true,

    },
    contactNumber: {
      type: Number,
      match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'],
    },
    reportingPerson: {
      type: String,
      required: true,
      trim: true,
    },
    assignedItems: [
      {
        asset: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Asset',
          required: true,
        },
        allocatedDate: {
          type: Date,
          required: true,
        },
        deallocatedDate: {
          type: Date,
          default: null,
        },
      }
    ],
    
    currentItem:[
    {  type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset',
      default: null,}
    ] 
   
    
  },
  {
    timestamps: true
  }
);


const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
