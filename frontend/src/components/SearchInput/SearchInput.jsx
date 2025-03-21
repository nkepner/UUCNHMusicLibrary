//write function for search input
// import react from "react";
import { useState, useEffect } from "react";
import "../styles/buttons.css";
import "./searchInput.css";
import SongList from "../SongList/SongList";
import AddForm from "../AddForm/AddForm";

function SearchInput({ access }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("default");
  const [themeSelected, setThemeSelected] = useState([]);
  const [themesDisplayed, setThemesDisplayed] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isAddSongModalOpen, setIsAddSongModalOpen] = useState(false);
  const [showAddSongButton, setShowAddSongButton] = useState(false);

  useEffect(() => {
    const handleOnLoad = async () => {
      try {
        //Grab themes from backend
        const apiUrl = import.meta.env.VITE_SONG_SERVICE_URL;
        const themesResponse = await fetch(`${apiUrl}/api/songs/themes`, {
          method: "POST",
          credentials: "include", // Include credentials to send cookies
          headers: { "Content-Type": "application/json" },
        });

        if (!themesResponse.ok) {
          console.error("Failed to fetch themes");
        }
        const data = await themesResponse.json();

        const themes = data.themes;

        setThemesDisplayed(themes);

        //Do pull for all songs on load

        const songsResponse = await fetch(`${apiUrl}/api/songs/search`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // Include credentials to send cookies
          body: JSON.stringify({
            words: searchTerm,
            sortType,
            themes: themeSelected,
          }),
        });

        if (songsResponse.ok) {
          const data = await songsResponse.json();
          if (data.length === 0) {
            console.log("No results found");
          }
          setSearchResults(data);
        } else {
          console.error("Failed to fetch songs");
        }
        //show add song button only to admin or subadmin
        if (access !== "User") {
          setShowAddSongButton(true);
        }
      } catch (error) {
        console.error("Error fetching themes", error);
      }
    };

    handleOnLoad();
  }, []);

  // handleOnLoad();

  // faking themes for now
  // const themesDisplayed = [
  //   "Christmas",
  //   "Easter",
  //   "Pentecost",
  //   "Advent",
  //   "Lent",
  //   "Thanksgiving",
  //   "Patriotic",
  //   "Wedding",
  //   "Funeral",
  //   "Baptism",
  //   "Communion",
  //   "General",
  //   "Children",
  //   "Youth",
  //   "Adult",
  //   "Community",
  //   "Peace",
  // ];

  const handleSearch = async (event) => {
    if (event) {
      event.preventDefault();
    }
    try {
      const apiUrl = import.meta.env.VITE_SONG_SERVICE_URL;

      if (!apiUrl) {
        console.error("Song service url is not set in .env");
      }

      const response = await fetch(`${apiUrl}/api/songs/search`, {
        method: "POST",
        credentials: "include", // Include credentials to send cookies
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          words: searchTerm,
          sortType,
          themes: themeSelected,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.length === 0) {
          console.log("No results found");
        }
        setSearchResults(data);
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const handleSort = (event) => {
    setSortType(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  const handleAddSong = () => {
    setIsAddSongModalOpen(true);
  };

  const handleThemeChange = (event) => {
    const { value, checked } = event.target;
    setThemeSelected((prevThemes) => {
      if (checked) {
        return [...prevThemes, value];
      } else {
        return prevThemes.filter((theme) => theme !== value);
      }
    });
  };

  // const handleThemeChange = (event) => {
  //   const { value, checked } = event.target;
  //   setThemeSelected((prevThemes) => {
  //     if (checked) {
  //       return [...prevThemes, value];
  //     } else {
  //       return prevThemes.filter((theme) => theme !== value);
  //     }
  //   });
  // };

  return (
    <>
      <div className="search-input">
        <div className="search-container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by title, composer, keywords, or lyrics"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="search-button" onClick={handleSearch}>
              🔎
            </button>
          </div>
          <div className="sort-dropdown">
            <label htmlFor="sort">Sort by:</label>
            <select value={sortType} id="sortBy" onChange={handleSort}>
              <option value="default">Select Sorting</option>
              <option value="titleA-Z">Title A to Z</option>
              <option value="titleZ-A">Title Z to A</option>
              <option value="composerA-Z">Composer A to Z</option>
              <option value="composerZ-A">Composer Z to A</option>
              <option value="mostRecent">
                Most to Least Recent Performance
              </option>
              <option value="leastRecent">
                Least to Most Recent Performance
              </option>
            </select>
          </div>
          {showAddSongButton && (
            <div className="add-song">
              <button className="add-song-button" onClick={handleAddSong}>
                Add Song
              </button>
            </div>
          )}
        </div>
        <div className="theme-container">
          {/* checkboxes for themes */}
          <label id="theme-header" htmlFor="themes">
            Themes:
          </label>
          <br />
          {themesDisplayed.map((theme) => {
            const lowerCaseTheme = theme.toLowerCase();
            const themeProperCased =
              theme.charAt(0).toUpperCase() + theme.slice(1);
            return (
              <div className="theme-tags">
                <input
                  key={theme}
                  className="theme-checkbox"
                  type="checkbox"
                  id={theme}
                  name={theme}
                  value={theme}
                  onChange={handleThemeChange}
                />
                <label htmlFor={lowerCaseTheme}>{themeProperCased}</label>
              </div>
            );
          })}
        </div>
      </div>
      <AddForm isOpen={isAddSongModalOpen} setIsOpen={setIsAddSongModalOpen} />
      <SongList songs={searchResults} access={access} />
    </>
  );
}

export default SearchInput;
