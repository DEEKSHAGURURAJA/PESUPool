'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

export const USERS = [
  {
    user_id: 2,
    name: 'Ananya Iyer',
    email: 'ananya.iyer@pes.edu',
    srn: 'PES1UG22EC204',
    role: 'STUDENT',
    persona: 'Passenger (Student)',
    campus: 'RR_CAMPUS',
    department: 'Electronics & Comm',
    wallet_balance: 620.00,
    avatar: '👩‍🎓'
  },
  {
    user_id: 1,
    name: 'Aarav Sharma',
    email: 'aarav.sharma@pes.edu',
    srn: 'PES1UG22CS101',
    role: 'STUDENT',
    persona: 'Driver & Passenger (Student)',
    campus: 'RR_CAMPUS',
    department: 'Computer Science',
    wallet_balance: 850.00,
    avatar: '👨‍🎓'
  },
  {
    user_id: 3,
    name: 'Rohan Kulkarni',
    email: 'rohan.kulkarni@pes.edu',
    srn: 'PES2UG21CS305',
    role: 'STUDENT',
    persona: 'Driver (EV Specialist)',
    campus: 'EC_CAMPUS',
    department: 'Computer Science',
    wallet_balance: 450.00,
    avatar: '⚡'
  },
  {
    user_id: 5,
    name: 'Dr. Venkatesh R',
    email: 'dr.venkatesh@pes.edu',
    srn: 'PES1FAC00188',
    role: 'FACULTY',
    persona: 'Faculty Driver (CS Dept)',
    campus: 'RR_CAMPUS',
    department: 'Computer Science',
    wallet_balance: 1500.00,
    avatar: '👨‍🏫'
  },
  {
    user_id: 10,
    name: 'Campus Mobility Admin',
    email: 'admin.pesupool@pes.edu',
    srn: 'PES1ADM00010',
    role: 'ADMIN',
    persona: 'University Administrator',
    campus: 'RR_CAMPUS',
    department: 'Campus Infrastructure',
    wallet_balance: 9999.00,
    avatar: '🛡️'
  }
];

const UserContext = createContext();

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(USERS[0]);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, USERS }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
