import React from 'react'
import congraBg from './congra.png';
import bg from './bg.jpg';

import './congraModal.css'

const awardPool = [
    'IPhone',
    'IPhone',
    'IPhone',
    'IPhone',
    'IPhone',
]
export default function CongraModal({ person, awardRank }) {
    console.log('rank', awardRank)
    return (
        <div className='CongraModal__bg' style={{ backgroundImage: `url(${bg})`}}>
            <div className='CongraModal__congra'>
                <img className='CongraModal__congra__img' src={congraBg} alt='' />
            </div>
            <div>
                <span className='CongraModal__name'>
                    {person.name}
                </span>
            </div>
            <div>
                <span className='CongraModal__award'>{awardPool[awardRank]}</span>
            </div>
        </div>
    );
}