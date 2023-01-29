import {useState} from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';

import { client, urlFor } from '../client';
import { fetchUser } from '../utils/fetchUser';

const Pin = ({pin: {postedBy, image, _id, destination, save}}) => {

    // log all of the props passed to this component, each labeled
    // console.log('Pin.jsx props: ', {postedBy, image, _id, destination, save});



    const [postHovered, setPostHovered] = useState(false);
    const [savingPost, setSavingPost] = useState(false)
    const navigate = useNavigate();
    const user = fetchUser();

    // use double negative to check if user has already saved the post
    const alreadySaved = !!(save?.filter((item) => item.postedBy._id === user.sub))?.length;

    const savePin = (id) => {
        if (!alreadySaved){
            setSavingPost(true);

            client
                .patch(id)
                .setIfMissing({save: []})
                .insert('after', 'save[-1]', [{
                    _key: uuidv4(),
                    userId: user.sub,
                    postedBy: {
                        _type: 'postedBy', 
                        _ref: user.sub
                    },
                }])
                .commit()
                .then(() => {
                    window.location.reload();
                    setSavingPost(false);
                })
        }
    }

    const deletePin = (id) => {
        client
            .delete(id)
            .then(() => {
                window.location.reload();
            })
    }


    function handleClick(e) {
        e.preventDefault();
        console.log('Donut Boy gott\'em again B)');
        // console.log(pin);
    }

  return (
    <div className="m-2">
        <div
            onMouseEnter={() => setPostHovered(true)}
            onMouseLeave={() => setPostHovered(false)}
            onClick={() => navigate(`/pin-detail/${_id}`)}
            className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all durration-500 ease-in-out"
        >
            <img className="rounded-lg w-fill" src={urlFor(image).width(250).url()} alt="user-post" onClick={handleClick}/>
            {postHovered && (
                <div 
                    className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
                    style={{height:'100%'}}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex g-2">
                            <a 
                                href={`${image?.asset?.url}?dl=`}
                                download
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                            >
                                <MdDownloadForOffline />
                            </a>
                        </div> 
                        {alreadySaved ? (
                            <button
                                type="button"
                                className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outlined-none"
                            >{save?.length} Saved</button>
                        ) : (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    savePin(_id);
                                }}
                                type="button"
                                className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outlined-none"
                            >{savingPost ? 'Saving...' : 'Save'}</button>
                        )}
                    </div>
                    <div className="flex justify-between items-center gap-2 w-full">
                        {destination && (
                            <a
                                href={destination}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:100 hover:shadow-md"
                            >
                                <BsFillArrowUpRightCircleFill />
                                {destination.slice(8, 17)}
                            </a>
                        )}
                        {postedBy?._id === user.sub && (
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deletePin(_id);
                                }}
                                type="button"
                                className="bg-white p-2 opacity-70 hover:opacity-100 font-bold text-dark text-base rounded-3xl hover:shadow-md outlined-none"
                            >
                                <AiTwotoneDelete />
                            </button>
                        )}
                    </div>
                </div>
            )} {/* end dl image*/}
        </div>
        <Link to={`/user-profile/${user?._id}`} className="flex gap-2 mt-2 items-center">
            <img 
                className="w-8 h-8 rounded-full object-cover"
                src={postedBy?.image} 
                alt="user-profile" 
            />
            <p className="font-semibold capitalize">{postedBy?.userName}</p>
        </Link>
    </div>
  )
}
export default Pin