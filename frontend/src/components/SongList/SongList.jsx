import "./SongList.css";
import React, { useState, useEffect } from 'react';

const handleEditClick = (songId) => {
    console.log('Edit clicked for song with ID:', songId);
};

const handleDeleteClick = (songId) => {
    console.log('Delete clicked for song with ID:', songId);
};

const handleTitleClick = (songId) => {
    console.log('Title clicked for song with ID:', songId);
};

const SongList = ({ songs }) => {
    const headers = ['Title', 'Composer', 'Arranger', 'Keywords', 'Last Performed', ' ', ' '];

    return (
        <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index} className="table-header">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {songs.length > 0 ? (
                        songs.map((song, index) => (
                            <tr key={song._id}>
                            <td>
                              {/* Apply the underlined class to the title */}
                              <span className="underlined" onClick={() => handleTitleClick(song._id)}>
                                {song.title || "N/A"}
                              </span>
                            </td>
                                <td>{song.composer || 'N/A'}</td>
                                <td>{song.arranger || 'N/A'}</td>
                                <td>{song.keywords ? song.keywords.join(', ') : 'N/A'}</td>
                                <td>{song.lastPerformed ? new Date(song.lastPerformed).toLocaleDateString() : 'N/A'}</td>
                                <td>
                                    {/* Correctly passing song.id */}
                                    <button onClick={() => handleEditClick(song._id)}>edit</button>
                                </td>
                                <td>
                                    {/* Correctly passing song.id */}
                                    <button onClick={() => handleDeleteClick(song._id)}>delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={headers.length}>No songs available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div >
    );
};

export default SongList;
