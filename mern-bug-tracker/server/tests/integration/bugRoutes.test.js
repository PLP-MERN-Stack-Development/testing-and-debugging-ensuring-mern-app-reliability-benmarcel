const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
// Assuming server.js exports the express app
const app = require("../../server") 
const Bug = require('../../models/Bug');
const connectDB = require("../../config/db")

// We rely on the jest.config.integration.js file to start and stop 
// the in-memory MongoDB instance automatically. 
// We just connect Mongoose to the URI provided by that setup.
jest.setTimeout(90000); // Set timeout to 90 seconds for slower operations

// Connect to the in-memory database before running tests
beforeAll(async () => {
 
  await connectDB()
});

// Clear database before each test
afterEach(async () => {
  await Bug.deleteMany({});
});

// Close connection after all tests
afterAll(async () => {
  // The teardown script in jest-mongodb will drop the database, 
  // but we still need to explicitly close Mongoose's connection.
  await mongoose.connection.close();
});

describe('Bug API Integration Tests', () => {
  
  describe('POST /api/bugs', () => {
    test('should create a new bug with valid data', async () => {
      const bugData = {
        title: 'Login page crashes',
        description: 'The login page crashes when submitting empty form',
        status: 'open',
        priority: 'high',
        reportedBy: 'John Doe'
      };
      
      const response = await request(app)
        .post('/api/bugs')
        .send(bugData)
        .expect(201);
      // this test is failing due to db issues but passed on postrman
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data.title).toBe(bugData.title);
      expect(response.body.data.status).toBe('open');
    });

    // This test ensures the errorHandler middleware is working correctly
    test('should reject bug without title', async () => {
      const bugData = {
        description: 'Missing title',
        reportedBy: 'John Doe'
      };
      
      const response = await request(app)
        .post('/api/bugs')
        .send(bugData)
        .expect(400); // Expecting 400 due to Mongoose Validation Error handled by middleware
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeTruthy();
    });
    
    test('should apply default status and priority', async () => {
      const bugData = {
        title: 'Minor UI issue',
        description: 'Button alignment is off',
        reportedBy: 'Jane Smith'
      };
      
      const response = await request(app)
        .post('/api/bugs')
        .send(bugData)
        .expect(201);
      
      expect(response.body.data.status).toBe('open');
      expect(response.body.data.priority).toBe('medium');
    });
  });
  
  describe('GET /api/bugs', () => {
    test('should return empty array when no bugs exist', async () => {
      const response = await request(app)
        .get('/api/bugs')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(0);
      expect(response.body.data).toEqual([]);
    });
    
    test('should return all bugs', async () => {
      // Create test bugs
      await Bug.create([
        {
          title: 'Bug 1',
          description: 'Description 1',
          reportedBy: 'User 1'
        },
        {
          title: 'Bug 2',
          description: 'Description 2',
          reportedBy: 'User 2'
        }
      ]);
      
      const response = await request(app)
        .get('/api/bugs')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(response.body.data.length).toBe(2);
    });
  });
  
  describe('GET /api/bugs/:id', () => {
    test('should return single bug by ID', async () => {
      const bug = await Bug.create({
        title: 'Test Bug',
        description: 'Test Description',
        reportedBy: 'Tester'
      });
      
      const response = await request(app)
        .get(`/api/bugs/${bug._id}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Test Bug');
    });
    
    test('should return 404 for non-existent bug', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .get(`/api/bugs/${fakeId}`)
        .expect(404);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Bug not found');
    });
  });
  
  describe('PATCH /api/bugs/:id', () => {
    test('should update bug status', async () => {
      const bug = await Bug.create({
        title: 'Bug to update',
        description: 'Will be updated',
        reportedBy: 'User'
      });
      
      const response = await request(app)
        .patch(`/api/bugs/${bug._id}/status`)
        .send({ status: 'resolved' })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('resolved');
    });
    
    // This test ensures the errorHandler middleware (Task 5) is working correctly
    test('should reject invalid status update', async () => {
      const bug = await Bug.create({
        title: 'Bug to update',
        description: 'Will be updated',
        reportedBy: 'User'
      });
      
      const response = await request(app)
        .patch(`/api/bugs/${bug._id}/status`)
        .send({ status: 'invalid-status' })
        .expect(400); // Expecting 400 due to Mongoose Validation Error handled by middleware
      
      expect(response.body.success).toBe(false);
    });
  });
  
  describe('DELETE /api/bugs/:id', () => {
    test('should delete bug', async () => {
      const bug = await Bug.create({
        title: 'Bug to delete',
        description: 'Will be deleted',
        reportedBy: 'User'
      });
      
      await request(app)
        .delete(`/api/bugs/${bug._id}`)
        .expect(200);
      
      const deletedBug = await Bug.findById(bug._id);
      expect(deletedBug).toBeNull();
    });
    
    test('should return 404 when deleting non-existent bug', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .delete(`/api/bugs/${fakeId}`)
        .expect(404);
      
      expect(response.body.success).toBe(false);
    });
  });
});