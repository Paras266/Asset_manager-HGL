
import mongoose from 'mongoose';
import { connectDB } from '../db_connection';


// Import necessary modules


// Import necessary modules
// Mock the mongoose module
jest.mock("mongoose", () => ({
  connect: jest.fn(),
}));

describe('connectDB() connectDB method', () => {
  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should connect to the database successfully', async () => {
      // Arrange: Set up the mock to resolve successfully
      const mockHost = 'mockHost';
      mongoose.connect.mockResolvedValue({
        connection: { host: mockHost },
      });

      // Act: Call the connectDB function
      await connectDB();

      // Assert: Ensure mongoose.connect was called with the correct URI
      expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGODB_URI);
      // Assert: Ensure the console.log was called with the correct message
      expect(console.log).toHaveBeenCalledWith(`MongoDB Connected: ${mockHost}`);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should handle connection errors gracefully', async () => {
      // Arrange: Set up the mock to reject with an error
      const mockError = new Error('Connection failed');
      mongoose.connect.mockRejectedValue(mockError);

      // Mock process.exit to prevent the test from exiting
      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});

      // Act: Call the connectDB function
      await connectDB();

      // Assert: Ensure mongoose.connect was called with the correct URI
      expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGODB_URI);
      // Assert: Ensure the console.error was called with the correct message
      expect(console.error).toHaveBeenCalledWith(`Error: ${mockError.message}`);
      // Assert: Ensure process.exit was called with code 1
      expect(mockExit).toHaveBeenCalledWith(1);

      // Clean up: Restore the original process.exit
      mockExit.mockRestore();
    });
  });
});