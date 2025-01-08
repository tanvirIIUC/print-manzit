import React, { useState, useRef, useEffect } from "react";
import tShirt from "../../assets/t-shirt.webp"; 

const UploadLogo = () => {
    const [logo, setLogo] = useState(null); 
    const [logoPosition, setLogoPosition] = useState({ top: 100, left: 100 }); 
    const [logoSize, setLogoSize] = useState(100);
    const [logoAspectRatio, setLogoAspectRatio] = useState(1);
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [resizing, setResizing] = useState(false);
    const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 }); 

    const imageRef = useRef(null);
    const logoRef = useRef(null); 
    const canvasRef = useRef(null);

    useEffect(() => {
        const storedLogo = localStorage.getItem("logo");
        if (storedLogo) {
            setLogo(storedLogo);
        }
    }, []);

    
    const handleLogoUpload = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const logoUrl = reader.result;
            setLogo(logoUrl);
            localStorage.setItem("logo", logoUrl); 

            const img = new Image();
            img.onload = () => {
                setLogoAspectRatio(img.width / img.height);
            };
            img.src = logoUrl;
        };
        reader.readAsDataURL(file);
    };

    
    const handleMouseDown = (e) => {
        if (!resizing) {
            setDragging(true);
            setOffset({
                x: e.clientX - logoPosition.left,
                y: e.clientY - logoPosition.top,
            });
        }
    };

    const handleMouseMove = (e) => {
        if (dragging) {
            let newTop = e.clientY - offset.y;
            let newLeft = e.clientX - offset.x;

            
            const imageRect = imageRef.current.getBoundingClientRect();
            const logoRect = logoRef.current.getBoundingClientRect();

            
            newTop = Math.max(0, Math.min(newTop, imageRect.height - logoRect.height));
            newLeft = Math.max(0, Math.min(newLeft, imageRect.width - logoRect.width));

            setLogoPosition({ top: newTop, left: newLeft });
        }

        if (resizing) {
            const deltaX = e.clientX - resizeStart.x;
            const deltaY = e.clientY - resizeStart.y;
            const newSize = logoSize + deltaX;

            const imageRect = imageRef.current.getBoundingClientRect();

           
            const maxWidth = imageRect.width * 0.8; 
            const maxHeight = imageRect.height * 0.8; 


            const newWidth = Math.min(maxWidth, Math.max(20, newSize)); 
            const newHeight = Math.min(maxHeight, newWidth / logoAspectRatio); 

            setLogoSize(newWidth);
            setResizeStart({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseUp = () => {
        setDragging(false);
        setResizing(false);
    };

    const handleResizeMouseDown = (e) => {
        e.preventDefault();
        setResizing(true);
        setResizeStart({ x: e.clientX, y: e.clientY });
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            handleLogoUpload(file); 
        }
    };

   
    const handleDownload = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        const tShirtImage = new Image();
        tShirtImage.src = tShirt;
        tShirtImage.onload = () => {
         
            canvas.width = tShirtImage.width;
            canvas.height = tShirtImage.height;
         
            context.drawImage(tShirtImage, 0, 0, canvas.width, canvas.height);

            const logoImage = new Image();
            logoImage.src = logo;
            logoImage.onload = () => {
                context.drawImage(
                    logoImage,
                    logoPosition.left,
                    logoPosition.top,
                    logoSize,
                    logoSize / logoAspectRatio 
                );

                
                const link = document.createElement("a");
                link.href = canvas.toDataURL("image/png");
                link.download = "tshirt_with_logo.png";
                link.click();
            };
        };
    };

    return (
        <div className="my-20 flex justify-center items-center">
            {/* T-shirt Image */}
            <div className="relative">
                <img
                    ref={imageRef} // Attach the reference to the image
                    src={tShirt}
                    alt="t-shirt"
                    className="w-96 h-auto"
                />

                {/* Uploaded Logo */}
                {logo && (
                    <div
                        ref={logoRef}
                        className="absolute"
                        style={{
                            top: `${logoPosition.top}px`,
                            left: `${logoPosition.left}px`,
                            width: `${logoSize}%`, // Dynamically resize the logo
                            cursor: resizing ? "nwse-resize" : "move",
                        }}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                    >
                        <img
                            src={logo}
                            alt="Uploaded Logo"
                            style={{
                                width: "100%",
                                height: "auto",
                            }}
                        />
                        {/* Resize handle (bottom-right corner) */}
                        <div
                            className="absolute bottom-0 right-0 bg-gray-700 p-2 cursor-se-resize"
                            onMouseDown={handleResizeMouseDown}
                        >
                            ↗
                        </div>
                    </div>
                )}
            </div>

            {/* Logo Upload Input (File Input + Drag & Drop Area) */}
            <div className=" flex flex-col items-center gap-20">
                <div
                    className="ml-10 border-dashed border-2 border-gray-400 p-5"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleLogoUpload(e.target.files[0])}
                        className="mb-5 text-white border rounded px-3 py-2"
                    />
                    <p>Drag and drop an image here, or use the file input to upload a logo.</p>
                    {logo && (
                        <div>
                            <p>Drag to position the logo, and resize by dragging the corner handle.</p>
                        </div>
                    )}

                </div>
                {/* Download Button */}
                {logo && (
                    <div className="mt-5">
                        <button
                            onClick={handleDownload}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg"
                        >
                            Download Final Image
                        </button>
                    </div>
                )}

            </div>

            {/* Final Image Canvas */}
            <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
    );
};

export default UploadLogo;
