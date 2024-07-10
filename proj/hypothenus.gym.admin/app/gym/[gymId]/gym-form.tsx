"use client"

import ErrorBoundary from '@/app/lib/components/errors/error-boundary';
import GymInfo from '@/app/lib/components/gym/gym-info';
import Loader from '@/app/lib/components/navigation/loader';
import axiosInstance from '@/app/lib/http/axiosInterceptorClient';
import { Gym, newGym } from '@/src/lib/entities/gym';
import { useEffect, useState } from 'react';

export default function GymForm({ gymId }: { gymId: string }) {
    const [gym, setGym] = useState<Gym>(newGym());
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        if (isLoading && gymId !== "new") {
            fetchGym(gymId);
        } else {
            setIsLoading(false);  
        }
    }, [gym]);

    const fetchGym = async (gymId: string) => {
        let response = await axiosInstance.get("/api/gyms/" + gymId);
        let gym: Gym = response.data;
        setGym(gym);

        setIsLoading(false);  
    }

    return (
        <ErrorBoundary>
            <div className="d-flex flex-column justify-content-start w-100 h-100 page-main">
                <div className="d-flex flex-row justify-content-center">
                    <h2 className="text-secondary pt-4 ps-2">{gym.name}</h2>
                </div>
                <div className="ps-2 pe-2">
                    <hr className="mt-0 mb-0"/>
                </div>

                {isLoading &&
                    <div className="flex-fill w-100 h-100">
                        <Loader />
                    </div>
                }

                {!isLoading &&
                   <div className="d-flex flex-column justify-content-between w-100 h-100 overflow-hidden ps-2 pe-2">
                        <GymInfo gym={gym} setGym={setGym}/>
                    </div>
                }
            </div>
        </ErrorBoundary>
    );
}
