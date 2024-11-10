import React, { useEffect, useState, useRef } from "react";
import { MapContainer, GeoJSON } from "react-leaflet";
import mapData from "./../data/countries.json";
import "leaflet/dist/leaflet.css";
import "./Map.css";
import CountryCheckbox from "./CountryCheckbox/CountryCheckbox";

// import { Country } from "../models/countries";
import { ImageOverlay, Layer } from "leaflet";

const MyMap = () => {
    const [visitedCountries, setVisitedCountries] = useState({});
    const geoJsonLayer = useRef(null);
    
    const [countriesByContinent, setCountriesByContinent] = useState({});

    useEffect(() => {
        const initialVisitedCountries = {};
        const groupedByContinent = {};

        mapData.features.forEach(country => {
            console.log(country)
            const countryName = country.properties.ADMIN;
            const continentName = country.properties.CONTINENT;

            initialVisitedCountries[countryName] = false;

            if (!groupedByContinent[continentName]) {
                groupedByContinent[continentName] = [];
            }
            groupedByContinent[continentName].push(countryName);
        });

        setVisitedCountries(initialVisitedCountries);
        setCountriesByContinent(groupedByContinent);
    }, []);

    const countryStyle = {
        fillColor: "white", 
        weight: 1,
        color: "black",
        fillOpacity: 0.5,
    };

    const onEachCountry = (country, layer:ImageOverlay) => {
        const countryName = country.properties.ADMIN;
        console.log(layer)

        // Set initial style based on state
        layer.setStyle({
            fillColor: visitedCountries[countryName] ? "yellow" : "white"
        });

        layer.on({
            click: () => toggleCountryColor(countryName)
        });
    };

    const toggleCountryColor = (countryName:string) => {
        console.log(countryName)
        setVisitedCountries(prevState => ({
            ...prevState,
            [countryName]: !prevState[countryName]
        }));
    };

    const handleCheckboxChange = (countryName:string) => {
        toggleCountryColor(countryName);
    };

    // Update GeoJSON layer styles when visitedCountries state changes
    useEffect(() => {
        if (geoJsonLayer.current) {
            geoJsonLayer.current.eachLayer(layer => {
                const countryName = layer.feature.properties.ADMIN;
                const newColor = visitedCountries[countryName] ? "orange" : "white";
                layer.setStyle({ fillColor: newColor });
            });
        }
    }, [visitedCountries]);

    return (
        <div>
            <MapContainer style={{ height: "80vh" }} zoom={2} center={[20, 100]}>
                <GeoJSON 
                    data={mapData.features} 
                    style={() => countryStyle} 
                    onEachFeature={onEachCountry} 
                    ref={geoJsonLayer} // Attach ref to GeoJSON layer
                />
            </MapContainer>
            <CountryCheckbox
                countriesByContinent={countriesByContinent}
                visitedCountries={visitedCountries}
                onCheckboxChange={handleCheckboxChange}
            />
        </div>
    );
};

export default MyMap;
