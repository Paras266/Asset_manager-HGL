import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema(
  {
    deviceType: {
      type: String,
      required: true,
      enum: ['Laptop', 'Desktop System', 'Monitor', 'Printer', 'UPS', 'Storage Devices', 'Server', 'Networking Devices', 'Wireless Mouse', 'Keyboard and Mouse', 'Other'],
    },
    OsKey: {
      type: String,
      trim: true,
      // match: [/^([A-Z0-9]{5}-){4}[A-Z0-9]{5}$/, 'Invalid OS Key format'],

    },

    invoice: {
      type: String,
      default: null,
    } ,
    
    OfficeKey: {
      type: String,
      trim: true,
      // match: [/^([A-Z0-9]{5}-){4}[A-Z0-9]{5}$/, 'Invalid Office Key format'],

    },
    modelNumber: {
      type: String,
      required: true,
      trim: true,
    },
    partNumber: {
      type: String,
      trim: true,
    },
    serialNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    express_serviceCode: {
      type: String,
      trim: true,
    },
    ram: {
      type: String,
      trim: true,
    },
    processor: {
      type: String,
      trim: true,
    },
    storageType: {
      type: String,
      enum: ['SATA', 'SSD', 'HDD', 'NVMe', 'None'],
      trim: true,
    },
    storageCapacity: {
      type: String,
      trim: true,
    },
    deviceName: {
      type: String,
      trim: true,
    },
    ipAssignment: {
      type: String,
      enum: ['Manual', 'DHCP', 'None'],
      trim: true,
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    lanMacAddress: {
      type: String,
      trim: true,
    },
    wifiMacAddress: {
      type: String,
      trim: true,
    },

    // Vendor info
    vendorName: {
      type: String,
      trim: true,
    },
    vendorContactNumber: {
      type: String,
      match: [/^[6-9]\d{9}$/, 'Invalid contact number'],
      trim: true,
    },
    vendorEmail: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address',
      ],
      trim: true,
    },
    vendorInvoiceNumber: {
      type: String,
      trim: true,
    },
    purchaseOrderNumber: {
      type: String,
      trim: true,
    },

    // Warranty
    warrantyType: {
      type: String,
      trim: true,
    },
    warrantyPeriod: {
      type: String, // Example: "1 Year", "3 Years"
      trim: true,
    },

    deviceCost: {
      type: Number,
      min: 0,
    },
    capexNumber: {
      type: String,
      trim: true,
    },
    deviceCondition: {
      type: String,
      enum: ['New', 'Good', 'Fair', 'Damaged', 'Repaired'],
      default: 'Good',
    },

    // Extra peripheral serial numbers
    mouseSerialNumber: {
      type: String,
      trim: true,
    },
    keyboardSerialNumber: {
      type: String,
      trim: true,
    },
    monitorScreenSize: {
      type: String,
      trim: true,
    },
    monitorSerialNumber: {
      type: String,
      trim: true,
    },

    otherDetails: {
      type: String,
      trim: true,
    },
    // Allocation history
    // This will store the history of allocations and deallocations
    allocationHistory: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        allocatedDate: {
          type: Date,
          required: true,
        },
        deallocatedDate: {
          type: Date,
          default: null, // set on deallocation
        },
      }
    ],

    // Reference to current user (optional)


    allocatedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    operatingSystem: {
      type: String,

    },

    officeApplication: {
      type: String
    },


    status: {
      type: String,
      enum: ['available', 'allocated', 'repair', 'damaged', "scrape"],
      default: 'available',
    },
  },
  {
    timestamps: true,
  }
);

const Asset = mongoose.model('Asset', assetSchema);
export default Asset;
