"use client";

import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface GoogleMapsButtonProps {
    address: string;
}

export default function GoogleMapsButton({ address }: GoogleMapsButtonProps) {
    const handleClick = () => {
        const encoded = encodeURIComponent(address);
        window.open(`https://www.google.com/maps/search/?api=1&query=${encoded}`, "_blank");
    };

    return (
        <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={handleClick}
        >
            <MapPin className="w-4 h-4 mr-2" />
            Abrir en Google Maps
        </Button>
    );
}
