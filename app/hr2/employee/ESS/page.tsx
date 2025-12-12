"use client";

import React, { useState } from 'react';
import { FileText, Clock, CheckCircle, Download, X } from 'lucide-react';

export default function ESSPage() {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');

  const RequestModal = ({ type }: { type: string }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {type === 'certificate' ? 'Request Certificate' : 
             type === 'leave' ? 'Request Leave' : 'New Request'}
          </h2>
          <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <form className="space-y-4">
          {type === 'certificate' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>Certificate of Employment</option>
                  <option>Training Certificate</option>
                  <option>Certificate of Completion</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  rows={3}
                  placeholder="Bank loan application, visa requirements, etc."
                ></textarea>
              </div>
            </>
          )}
          
          {type === 'leave' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>Vacation Leave</option>
                  <option>Sick Leave</option>
                  <option>Emergency Leave</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input 
                    type="date" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input 
                    type="date" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  rows={3}
                  placeholder="Explain your reason for leave..."
                ></textarea>
              </div>
            </>
          )}

          {type === 'other' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="e.g., Clearance, ID Request" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  rows={4}
                  placeholder="Provide details about your request..."
                ></textarea>
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button 
              type="button" 
              onClick={() => setShowModal(false)} 
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-6 max-h-screen overflow-y-scroll">
      {showModal && <RequestModal type={modalType} />}

      <div>
        <h1 className="text-3xl font-bold text-gray-800">Employee Self-Service</h1>
        <p className="text-gray-600 mt-1">Request certificates, leaves, and other documents</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-purple-700 font-medium">Total Requests</p>
              <p className="text-3xl font-bold text-purple-900 mt-1">2</p>
              <p className="text-xs text-purple-600 mt-1">All Time</p>
            </div>
            <FileText className="text-purple-600" size={24} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl border border-amber-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-amber-700 font-medium">Pending</p>
              <p className="text-3xl font-bold text-amber-900 mt-1">1</p>
              <p className="text-xs text-amber-600 mt-1">Awaiting Review</p>
            </div>
            <Clock className="text-amber-600" size={24} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-green-700 font-medium">Approved</p>
              <p className="text-3xl font-bold text-green-900 mt-1">1</p>
              <p className="text-xs text-green-600 mt-1">Completed</p>
            </div>
            <CheckCircle className="text-green-600" size={24} />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => {
              setModalType('new');
              setShowModal(true);
            }}
            className="p-6 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors text-center"
          >
            <FileText className="mx-auto mb-3 text-purple-600" size={32} />
            <span className="text-sm font-medium text-gray-800 block">New Request</span>
          </button>
          
          <button 
            onClick={() => {
              setModalType('certificate');
              setShowModal(true);
            }}
            className="p-6 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors text-center"
          >
            <FileText className="mx-auto mb-3 text-purple-600" size={32} />
            <span className="text-sm font-medium text-gray-800 block">Certificate</span>
          </button>
          
          <button 
            onClick={() => {
              setModalType('leave');
              setShowModal(true);
            }}
            className="p-6 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors text-center"
          >
            <FileText className="mx-auto mb-3 text-purple-600" size={32} />
            <span className="text-sm font-medium text-gray-800 block">Leave Request</span>
          </button>
          
          <button 
            onClick={() => {
              setModalType('other');
              setShowModal(true);
            }}
            className="p-6 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors text-center"
          >
            <FileText className="mx-auto mb-3 text-purple-600" size={32} />
            <span className="text-sm font-medium text-gray-800 block">Other Documents</span>
          </button>
        </div>
      </div>

      {/* Request Status */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Request Status</h3>
        
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search requests..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-3">
          {/* Approved Request */}
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">Certificate of Employment</h4>
                <p className="text-sm text-gray-600 mt-1">Required for bank loan application</p>
                <p className="text-xs text-gray-500 mt-2">Requested on: 2024-11-01</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm whitespace-nowrap ml-3">
                <CheckCircle size={14} className="inline mr-1" />
                Approved
              </span>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">
              <Download size={16} />
              Download
            </button>
          </div>

          {/* Pending Request */}
          <div className="p-4 border border-amber-200 rounded-lg bg-amber-50">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">Training Certificate</h4>
                <p className="text-sm text-gray-600 mt-1">Certificate for Digital Learning Tools Workshop</p>
                <p className="text-xs text-gray-500 mt-2">Requested on: 2024-11-10</p>
              </div>
              <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm whitespace-nowrap ml-3">
                <Clock size={14} className="inline mr-1" />
                Pending
              </span>
            </div>
            <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm">
              Cancel Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}