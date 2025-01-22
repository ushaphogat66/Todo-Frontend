"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authUser } from '@/features/auth/auth';
import { RootState, AppDispatch } from '@/app/todo/store';
import { toast } from 'sonner';

const useAuth = () => {
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!user && token) {
     dispatch(authUser()).then((result: any) => {
     });
    }
  }, [user, token, dispatch]);
};

export default useAuth;