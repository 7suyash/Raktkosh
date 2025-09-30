import React, { useEffect, useState } from 'react';
import { inventoryAPI, donorsAPI } from '../../services/api';

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function FindBlood() {
  const [bloodGroup, setBloodGroup] = useState('');
  const [location, setLocation] = useState(null); // { lat, lon }
  const [manualLocation, setManualLocation] = useState(''); // For manual input fallback
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState({ inventory: [], donors: [] });
  const [error, setError] = useState('');

  // Get user location via browser geolocation
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => alert('Unable to retrieve your location.')
    );
  };

  // Handle manual location input change
  const onManualLocationChange = (e) => {
    setManualLocation(e.target.value);
  };

  // Validate and perform search
  const handleSearch = async () => {
    if (!bloodGroup) {
      setError('Please select a blood group.');
      return;
    }

    let searchLocation = location;

    // If no auto location, try to parse manual location input (like "lat,lon")
    if (!searchLocation) {
      if (!manualLocation) {
        setError('Please provide location: either click "Get My Location" or enter manually as "lat,lon".');
        return;
      } else {
        const parts = manualLocation.split(',');
        if (parts.length !== 2) {
          setError('Manual location format invalid. Expected: "latitude,longitude"');
          return;
        }
        const lat = parseFloat(parts[0].trim());
        const lon = parseFloat(parts[1].trim());
        if (isNaN(lat) || isNaN(lon)) {
          setError('Manual location latitude and longitude must be numbers.');
          return;
        }
        searchLocation = { lat, lon };
      }
    }

    setError('');
    setSearching(true);
    try {
      const invResp = await inventoryAPI.searchBlood({
        bloodGroup,
        lat: searchLocation.lat,
        lon: searchLocation.lon,
        radius: 10000
      });
      // Donors endpoint may not be available yet; ignore errors for now
      setResults({ inventory: invResp.data || [], donors: [] });
    } catch (err) {
      setError('Error fetching search results. Please try again.');
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  // Auto-search when user location is provided and blood group is selected
  useEffect(() => {
    if (bloodGroup && location && !searching) {
      handleSearch();
    }
  }, [bloodGroup, location]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-red-600">Find Blood Nearby</h2>

      <div className="mb-4 flex flex-col sm:flex-row gap-4 items-center">
        <select
          className="input-field w-full sm:w-48"
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
        >
          <option value="">Select Blood Group</option>
          {bloodGroups.map(bg => (
            <option key={bg} value={bg}>{bg}</option>
          ))}
        </select>

        <button className="btn-secondary" onClick={getUserLocation} type="button">
          Get My Location
        </button>

        <input
          type="text"
          placeholder="Or enter location: lat,lon"
          value={manualLocation}
          onChange={onManualLocationChange}
          className="input-field w-full sm:w-60"
        />

        <button className="btn-primary" onClick={handleSearch} disabled={searching}>
          {searching ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && <p className="text-red-500 font-semibold mb-4">{error}</p>}

      <div>
        <h3 className="text-xl font-semibold mb-2">Available Blood in Blood Banks:</h3>
        {results.inventory.length === 0 ? (
          <p>No blood availability found matching your criteria.</p>
        ) : (
          results.inventory.map(item => (
            <div key={item._id} className="card p-4 mb-4 border rounded shadow">
              <p><strong>Blood Bank:</strong> {item.bloodBank.name}</p>
              <p><strong>Blood Group:</strong> {item.bloodGroup}</p>
              <p><strong>Available Units:</strong> {item.availableUnits}</p>
              <p><strong>Distance:</strong> {(item.distance / 1000).toFixed(2)} km</p>
              <p><strong>Contact:</strong> {item.bloodBank.phone}</p>
            </div>
          ))
        )}
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Eligible Donors Nearby:</h3>
        {results.donors.length === 0 ? (
          <p>No eligible donors found matching your criteria.</p>
        ) : (
          results.donors.map(donor => (
            <div key={donor._id} className="card p-4 mb-4 border rounded shadow">
              <p><strong>Name:</strong> {donor.userId?.name ?? 'N/A'}</p>
              <p><strong>Blood Group:</strong> {donor.bloodGroup}</p>
              <p><strong>Last Donation:</strong> {donor.lastDonation ? new Date(donor.lastDonation).toLocaleDateString() : 'Never'}</p>
              <p><strong>Contact:</strong> {donor.userId?.phone ?? 'N/A'}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
