'use client';

import Image from 'next/image';
import { UploadButton } from '@/lib/uploadthing';
import { addPhoto } from '@/lib/actions/member.actions';
import { useState, useEffect } from 'react';
import { Photo } from '@/types';
import { useRouter } from 'next/navigation';

export default function PhotoGallery({ photos, isOwnProfile }: { photos: Photo[]; isOwnProfile: boolean }) {
    const [galleryPhotos, setGalleryPhotos] = useState(photos);
    const router = useRouter();

    useEffect(() => {
        setGalleryPhotos(photos);
    }, [photos]);

    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

    const handleUploadComplete = async (res: any) => {
        if (res && res[0]) {
            const url = res[0].url;
            try {
                await addPhoto(url);
                router.refresh();
            } catch (error) {
                console.error(error);
                alert('Failed to save photo');
            }
        }
    };

    const openModal = (photo: Photo) => {
        setSelectedPhoto(photo);
    };

    const closeModal = () => {
        setSelectedPhoto(null);
    };

    return (
        <div>
            {isOwnProfile && (
                <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800">Add New Photo</h3>
                    <UploadButton
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        endpoint={"galleryImage" as any}
                        onClientUploadComplete={handleUploadComplete}
                        onUploadError={(error: Error) => {
                            alert(`ERROR! ${error.message}`);
                        }}
                    />
                </div>
            )}

            {galleryPhotos.length === 0 ? (
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                    <p className="text-gray-500">No photos uploaded yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryPhotos.map((photo) => (
                        <div
                            key={photo._id}
                            className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group cursor-pointer"
                            onClick={() => openModal(photo)}
                        >
                            <Image
                                src={photo.url}
                                alt="Gallery photo"
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                                <span className="text-white opacity-0 group-hover:opacity-100 font-medium">View</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Image Modal */}
            {selectedPhoto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-90" onClick={closeModal}>
                    <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-white hover:text-gray-300 z-50 p-2 bg-black bg-opacity-50 rounded-full"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="relative w-full h-full">
                            <Image
                                src={selectedPhoto.url}
                                alt="Full size photo"
                                fill
                                className="object-contain"
                                quality={100}
                            />
                        </div>

                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                            <a
                                href={selectedPhoto.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 px-6 py-3 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-100 transition-colors shadow-lg"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                <span>Download Original</span>
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
