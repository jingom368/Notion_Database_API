import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Notion() {

    const [name, setName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [extraInfo, setExtraInfo] = useState('')

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await axios.get('http://localhost:5000/api/data');
    //             setData(response.data);
    //         } catch (error) {
    //             console.error('Error fetching data', error);
    //         }
    //     };

    //     fetchData();
    // }, []);

    const submitFormNotion = () => {
        console.log('we are in!' + name)
        axios('http://localhost:4000/api/pages', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                name: name,
                phoneNumber: phoneNumber,
                extraInfo: extraInfo
            })
        }).then(response => response.json())
            .then(data => {
                console.log('Success! ', data)
            }).catch((error) => {
                console.log('Error:', error)
            })
    }

    return (
        <div>
            <p>Name</p>
            <input type="text" id="name" onChange={(e) => setName(e.target.value)} />
            <p>Phone Number</p>
            <input type="text" id="phoneNumber" onChange={(e) => setPhoneNumber(e.target.value)} />
            <p>Anything else?</p>
            <textarea onChange={(e) => setExtraInfo(e.target.value)} rows={10} cols={25} />

            <button onClick={submitFormNotion}>
                submit to notion
            </button>
        </div>
    )
}