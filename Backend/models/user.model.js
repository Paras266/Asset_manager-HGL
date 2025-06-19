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
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address',
      ],
    },
    department: {
      type: String,
      required: true,
      enum: ['IT', 'HR', 'Finance', 'Production', 'Planing', 'Manufacture', 'Design', 'Quality'], // update as per your dropdown options
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
      enum: ['Manager', 'Engineer', 'Technician', 'Intern', 'Executive', 'GET'], // predefined roles
    },
    roleInCompany: {
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
      required: true,
      trim: true,
    },


    permanentAddress
      : {
      type: String,
      required: true,
      trim: true,
    },
    presentAddress: {
      type: String,
      required: true,
      trim: true,

    },
    contactNumber: {
      type: Number,
      required: true,
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
