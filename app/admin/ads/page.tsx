"use client";
import React, { useState } from 'react';
import Photo from "@/components/admin/Photo";

interface Section {
    id: string;
    title: string;
    position: string;
}

const sections: Section[] = [
    // Header sections
    { id: 'headerTop', title: 'Header Top', position: 'header' },
    { id: 'headerBottom', title: 'Header Bottom', position: 'header' },
    { id: 'headerLeft', title: 'Header Left', position: 'header' },
    { id: 'headerRight', title: 'Header Right', position: 'header' },
    // Category sections
    { id: 'categoryTop', title: 'Category Top', position: 'category' },
    { id: 'categoryBottom', title: 'Category Bottom', position: 'category' },
    { id: 'categoryLeft', title: 'Category Left', position: 'category' },
    { id: 'categoryRight', title: 'Category Right', position: 'category' },
    // Details sections
    { id: 'detailsTitleTop', title: 'Details Title Top', position: 'details' },
    { id: 'detailsTitleBottom', title: 'Details Title Bottom', position: 'details' },
    { id: 'detailsImagesTop', title: 'Details Images Top', position: 'details' },
    { id: 'detailsImagesBottom', title: 'Details Images Bottom', position: 'details' },
    { id: 'detailsDescriptionTop', title: 'Details Description Top', position: 'details' },
    { id: 'detailsDescriptionCentre', title: 'Details Description Centre', position: 'details' },
    { id: 'detailsDescriptionBottom', title: 'Details Description Bottom', position: 'details' },
    { id: 'detailsRelatedPostTop', title: 'Details Related Post Top', position: 'details' },
    { id: 'detailsRelatedPostBottom', title: 'Details Related Post Bottom', position: 'details' },
];

const IndexPage: React.FC = () => {
    const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>(
        sections.reduce((acc, section) => {
            acc[section.id] = 'code';
            return acc;
        }, {} as { [key: string]: string })
    );

    const handleSelectChange = (id: string, value: string) => {
        setSelectedOptions(prev => ({
            ...prev,
            [id]: value,
        }));
    };

    return (
        <div className="my-4 container">
            <h1 className='text-xl font-bold mb-4'>
                Advertisement
            </h1>

            {['header', 'category', 'details'].map(position => (
                <div key={position}>
                    <h1 className='text-md border-y border-dashed border-main font-semibold mt-2'>
                        {position.charAt(0).toUpperCase() + position.slice(1)}
                    </h1>
                    <div className="w-full grid md:grid-cols-2 grid-cols-1 gap-4">
                        {sections.filter(section => section.position === position).map(section => (
                            <div key={section.id}>
                                <div className="flex items-center justify-between mt-2">
                                    <p>
                                        {section.title}
                                    </p>
                                    <select
                                        className="px-2 max-w-sm outline-none"
                                        value={selectedOptions[section.id]}
                                        onChange={(e) => handleSelectChange(section.id, e.target.value)}
                                    >
                                        <option value="code">Code</option>
                                        <option value="images">Images</option>
                                    </select>
                                </div>
                                {selectedOptions[section.id] === 'code' ? (
                                    <textarea
                                        rows={4}
                                        placeholder="html code"
                                        className="p-2 mt-2 w-full outline-none rounded-md"
                                    />
                                ) : (
                                    <>
                                        <Photo
                                            title="Photo (600x600px)"
                                            img=""
                                        />
                                        <input
                                            type="text"
                                            placeholder="Link"
                                            className="p-2 mt-2 w-full outline-none rounded-md"
                                        />
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default IndexPage;