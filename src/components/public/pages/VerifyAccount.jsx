import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../../../redux/axiosInstance';

const VerifyAccount = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);

  const uid = searchParams.get('uid');
  const code = searchParams.get('code');

  useEffect(() => {
    const verifyAccount = async () => {
      try {
        const res = await axiosInstance.get(`/v1/home/verify`, {
          params: { uid, code },
        });

        if (res?.data?.status === 'success') {
          toast.success(res.data.message || 'Account verified successfully!');
          setTimeout(() => navigate('/login'), 3000);
        } else {
          toast.error(res.data.message || 'Invalid verification link.');
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Verification failed.');
      } finally {
        setVerifying(false);
      }
    };

    if (uid && code) {
      verifyAccount();
    } else {
      toast.error('Invalid verification link!');
      setVerifying(false);
    }
  }, [uid, code, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
      {verifying ? 'Verifying your account...' : 'You can now close this tab.'}
    </div>
  );
};

export default VerifyAccount;
