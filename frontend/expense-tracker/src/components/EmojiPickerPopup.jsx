import React, { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { LuImage, LuX } from 'react-icons/lu';

const EmojiPickerPopup = ({ icon, onSelect }) => {
    const [showPicker, setShowPicker] = useState(false);
    return (
        <div className="flex flex-col md:flex-row items-start gap-5 mb-6">
            <div className="flex items-center gap-4 cursor-pointer"
                onClick={() => setShowPicker(true)}
            >
                <div className="w-12 h-12 flex items-center justify-center text-2xl bg-purple-50 rounded-lg">
                    {icon ? (
                        <img src={icon} alt="Selected Icon" className="w-12 h-12" />
                    ) : (
                        <LuImage className="text-2xl" />
                    )}
                </div>
                <p className="">{icon ? "Change icon" : "Pick icon"}</p>
            </div>
            {showPicker && (
                <div className="relative">
                    <button
                        className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded-full absolute -top-2 -right-2 cursor-pointer z-10"
                        onClick={() => setShowPicker(false)}>
                        <LuX className="text-2xl" />
                    </button>

                    <EmojiPicker
                        open={showPicker}
                        onEmojiClick={(emoji) => onSelect(emoji?.imageUrl || "")}
                    />
                </div>
            )}

        </div>
    )
}

export default EmojiPickerPopup
