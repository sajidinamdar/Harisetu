import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface PermissionGateProps {
    children: React.ReactNode;
}

const PermissionGate: React.FC<PermissionGateProps> = ({ children }) => {
    const [permissionsGranted, setPermissionsGranted] = useState<boolean>(false);
    const [checking, setChecking] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        checkPermissions();
    }, []);

    const checkPermissions = async () => {
        try {
            // Check if permissions are already granted
            const locationStatus = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
            const micStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });

            if (locationStatus.state === 'granted' && micStatus.state === 'granted') {
                setPermissionsGranted(true);
            }
        } catch (err) {
            console.error('Error checking permissions:', err);
        } finally {
            setChecking(false);
        }
    };

    const requestPermissions = async () => {
        try {
            setChecking(true);
            setError(null);

            // Request Geolocation
            await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });

            // Request Microphone
            await navigator.mediaDevices.getUserMedia({ audio: true });

            setPermissionsGranted(true);
        } catch (err: any) {
            console.error('Permission request failed:', err);
            setError('Both location and microphone permissions are required to use HaritSetu features.');
        } finally {
            setChecking(false);
        }
    };

    if (checking) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-900">
                <div className="text-white text-xl">Checking system permissions...</div>
            </div>
        );
    }

    if (!permissionsGranted) {
        return (
            <div className="flex items-center justify-center min-vh-100 bg-dark bg-opacity-90 position-fixed w-100 top-0 start-0 z-3">
                <div className="bg-white p-5 rounded-4 shadow-lg text-center max-w-md mx-3">
                    <div className="mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-shield-lock text-primary" viewBox="0 0 16 16">
                            <path d="M5.338 1.59a.5.5 0 0 0-.676.223 6.47 6.47 0 0 0-.747 2.858c0 .58.074 1.155.223 1.71l.052.19c.142.528.341 1.044.594 1.536l.122.238a7.07 7.07 0 0 0 .411.688l.059.085c.023.033.047.066.07.098.33.453.7.864 1.106 1.232l.142.125a6.63 6.63 0 0 0 .416.331l.162.115c.067.045.136.088.204.129l.138.08c.159.09.324.171.493.243l.112.046c.302.122.617.213.938.272l.18.031c.148.024.298.041.45.051l.157.01c.097.004.195.006.293.006s.196-.002.293-.006l.157-.01c.152-.01.302-.027.45-.051l.18-.03c.321-.06.636-.15.938-.273l.112-.046c.17-.072.334-.153.493-.242l.138-.08c.07-.043.137-.084.204-.13l.162-.114a6.63 6.63 0 0 0 .416-.332l.142-.125c.407-.367.777-.779 1.107-1.232.023-.032.047-.065.07-.098l.059-.085a7.07 7.07 0 0 0 .411-.688l.122-.238c.253-.492.452-1.008.594-1.536l.052-.19c.15-.555.223-1.13.223-1.71 0-1.077-.253-2.113-.747-3.081a.5.5 0 0 0-.676-.223c-.968.494-1.936.988-2.904 1.482l-.121.062a.5.5 0 0 0-.256.438v1.1c0 .276-.224.5-.5.5s-.5-.224-.5-.5V3.88l-.203.104a.5.5 0 0 0-.256.438v5.52c0 .276-.224.5-.5.5s-.5-.224-.5-.5V4.66l-.203.104a.5.5 0 0 0-.256.438v3.42c0 .276-.224.5-.5.5s-.5-.224-.5-.5V5.44l-.203.104a.5.5 0 0 0-.256.438v1.12c0 .276-.224.5-.5.5s-.5-.224-.5-.5V6.22l-.203.104a.5.5 0 0 0-.256.438v5.52c0 .276-.224.5-.5.5s-.5-.224-.5-.5V6.74l-.203.104a.5.5 0 0 0-.256.438V9.1c0 .276-.224.5-.5.5s-.5-.224-.5-.5V7.52l-.203.104a.5.5 0 0 0-.256.438v2.146c0 .276-.224.5-.5.5s-.5-.224-.5-.5V8.3l-.203.104a.5.5 0 0 0-.256.438V12c0 .276-.223.5-.5.5s-.5-.224-.5-.5V9.08l-.203.104a.5.5 0 0 0-.256.438V11c0 .276-.224.5-.5.5s-.5-.224-.5-.5V9.86l-.203.104a.5.5 0 0 0-.256.438V12c0 .276-.224.5-.5.5s-.5-.224-.5-.5z" />
                        </svg>
                    </div>
                    <h2 className="fw-bold mb-3">Permissions Required</h2>
                    <p className="text-muted mb-4">
                        To provide the best agricultural advice and local suggestions, HaritSetu needs access to your <strong>Location</strong> and <strong>Microphone</strong>.
                    </p>
                    <button
                        onClick={requestPermissions}
                        className="btn btn-primary btn-lg w-100 py-3 rounded-pill fw-bold shadow-sm"
                    >
                        Grant Permissions
                    </button>
                    {error && (
                        <div className="mt-3 text-danger small bg-danger bg-opacity-10 p-2 rounded">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default PermissionGate;
