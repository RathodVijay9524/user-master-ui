import { useState, useEffect, useRef } from 'react';

export const useVoiceRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordWave, setRecordWave] = useState([]);
  const [audioStream, setAudioStream] = useState(null);
  
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const rafIdRef = useRef(null);

  // Timer effect
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => setRecordingTime((prev) => prev + 1), 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Audio recording effect
  useEffect(() => {
    let audioCtx;
    let analyser;
    let source;
    let dataArray;
    let rafId;

    if (isRecording) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        setAudioStream(stream);
        
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        
        audioContextRef.current = audioCtx;
        analyserRef.current = analyser;

        const tick = () => {
          analyser.getByteFrequencyData(dataArray);
          const values = Array.from(dataArray).slice(0, 20).map((v) => (v / 255) * 100);
          setRecordWave(values);
          rafId = requestAnimationFrame(tick);
          rafIdRef.current = rafId;
        };
        tick();
      }).catch((error) => {
        console.error('Error accessing microphone:', error);
        setIsRecording(false);
      });
    } else {
      if (audioStream) {
        audioStream.getTracks().forEach((track) => track.stop());
        setAudioStream(null);
      }
      setRecordWave([]);
      
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    }

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      if (audioStream) {
        audioStream.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [isRecording]);

  const startRecording = () => setIsRecording(true);
  const stopRecording = () => setIsRecording(false);
  const toggleRecording = () => setIsRecording(!isRecording);

  return {
    isRecording,
    recordingTime,
    recordWave,
    audioStream,
    startRecording,
    stopRecording,
    toggleRecording,
  };
};
