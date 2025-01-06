const db = require('./db.service');
const helper = require('../helper');
const config = require('../config');

    async function create(artist) {
        console.log(artist);        
        const artistResult = await db.query(
            `INSERT INTO artists (
            image, name, stagename, albumcount, label, publisher, careerstart, note
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
            artist.image,
            artist.name,
            artist.stagename,
            artist.albumcount,
            artist.label,
            artist.publisher,
            artist.careerstart,
            0
        ]
        );
        console.log(artistResult);        
        const artistId = artistResult.insertId;
        if (artist.socialnetworks && artist.socialnetworks.length > 0) {
            for (const social of artist.socialnetworks) {
                await db.query(
                    `INSERT INTO artist_social_networks (artist_id, name, url) VALUES (?, ?, ?)`,
                    [artistId, social.name, social.url]
                );
            }
        }
    
        return artistId;
    }
    async function createnetwork(network) {
        const networkresult = await db.query(
            `INSERT INTO artist_social_networks (artist_id, name, url) VALUES (?, ?, ?)`,
            [network.artistId, network.name, network.url]
        );
        return networkresult;
    }
    
    async function update(id, artist) {
        const result = await db.query(
            `UPDATE artists SET 
            image = ?, 
            name = ?, 
            stagename = ?, 
            albumcount = ?,
            label = ?,
            publisher = ?,
            careerstart = ?
            WHERE id = ?`,
            [
            artist.image,
            artist.name,
            artist.stagename,
            artist.albumcount,
            artist.label,
            artist.publisher,
            artist.careerstart,
            id
            ]
        );
        return result.affectedRows > 0;
    }
    
    async function deletea(id) {
        await db.query(
            'DELETE FROM artist_social_networks WHERE artist_id = ?',
            [id]
        );
        const result = await db.query(
            'DELETE FROM artists WHERE id = ?',
            [id]
        );
    
        return result.affectedRows > 0;
    }
    
    async function findById(id) {
        const [artistRows] = await db.query(
            'SELECT id, image, name, stagename AS stageName, albumcount AS albumCount, label, publisher, careerstart AS careerStartDate FROM artists WHERE id = ?',
            [id]
        );
        if (artistRows.length === 0) {
            return null;
        }
        const artist = artistRows;
        const socialNetworksRows = await db.query(
            'SELECT name, url FROM artist_social_networks WHERE artist_id = ?',
            [id]
        );
        console.log(socialNetworksRows);
        artist.socialnetworks = []
        artist.socialnetworks = socialNetworksRows;
    
        return artist;
    }
    
    async function findAll(page = 1) {
        const offset = helper.getOffset(page, config.listPerPage);
        const artistRows = await db.query(
            `SELECT * FROM artists LIMIT ${offset}, ${config.listPerPage}`,
        );
        console.log("artiste row: ", artistRows);        
        if (artistRows.length === 0) {
            return null;
        }
        const artist = artistRows;
        if (artist && artist.length > 0) {
            for (const social of artist) {
                const socialNetworksRows = await db.query(
                    'SELECT * FROM artist_social_networks where artist_id = ?',
                    [social.id]
                );
                social.socialnetworks = socialNetworksRows;
            }
        }
    
        const data = helper.emptyorRows(artist);
        const meta = {page};
        return {
            data,
            meta
        };
    }

    async function recherche(text) {
        try {
            const searchTerm = `%${text}%`;
            const rows = await db.query(
                `SELECT * FROM artists WHERE 
                name LIKE ?
                or stagename LIKE ?`,
                [searchTerm, searchTerm]
            );
            const data = helper.emptyorRows(rows);
            return {
                data
            };
        } catch (error) {
            console.error('Error selecting student:', error);
            throw error;
        }
    }


    module.exports = {
        create,
        update,
        findAll,
        createnetwork,
        findById,
        deletea,
        recherche
    }