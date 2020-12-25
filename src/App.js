import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
// import origin from "./nameList.json";
import CongraModal from './CongraModal';

const origin = Array(600).fill(1);

const originData = origin.slice(0, 20)
  .map((name, index) => ({ name: index, id: index }));

const singleHeight = 50;

const initialSpeed = 8;



function NameItem({ name }) {
  return <div className="name-item">{name}</div>;
}


const containerHeight = 650;


// 整个循环显示的list需要2n+1项
function generateCycleData(data) {
  return data
  .slice(-1)
  .map((item) => ({ ...item, id: "top-top-" + item.id })) // 1 项
  .concat(data.map((item) => ({ ...item, id: "top-" + item.id }))) // n 项
  .concat(data); // n 项
}

export default function App() {
  // 人员名单，{ name, id }
  const [nameList, setNameList] = useState(originData);
  const [y, setY] = useState(-(originData.length + 1) * singleHeight); // y始终是负的
  const [started, setStarted] = useState(false);
  const prevStarted = useRef(false);
  const [speed, setSpeed] = useState(0);
  const [luckyOne, setLuckyOne] = useState();
  const [awardRank, setAwardRank] = useState(0);

  const cycleNameList = useMemo(() => {
    return generateCycleData(nameList);
  }, [nameList]);


  
  const findLuckyOne = useCallback(() => {
    let luckyOneIndex = Math.ceil(Math.abs(y - (nameList.length * singleHeight / 2)) / singleHeight);
    luckyOneIndex = (luckyOneIndex + nameList.length) % nameList.length;
    console.log('findLuckyOne ' + y + ', ' + luckyOneIndex)
    const luckyOne = nameList[luckyOneIndex];
    setAwardRank(rank => {
      console.log('setAwardRank ', rank, rank + 1)
      return rank + 1;
    });
    setLuckyOne(luckyOne);
    setNameList(prev => prev.filter(item => item.id !== luckyOne.id));
  }, [y, nameList]);

  useEffect(() => {
    const handleSpaceDown = (event) => {
      if (event.code === "Space") {
        if (luckyOne) {
          setLuckyOne(null);
        } else {
          setStarted((prev) => !prev);
        }
      }
    };
    window.addEventListener("keydown", handleSpaceDown);
    return () => {
      window.removeEventListener("keydown", handleSpaceDown);
    };
  }, [luckyOne]);
  
  useEffect(() => {
    if (started !== prevStarted.current) {
      if (!started && prevStarted.current) {
        // 停止
        console.log('停止');
        const timer = setInterval(() => {
          setSpeed(prev => {
            console.log('sub speed ', prev);
            if (prev === 1) {
              findLuckyOne();
              window.clearInterval(timer)
            }
            return Math.max(0, prev - 1);
          });
        }, 100);
   
      } else if (started && !prevStarted.current) {
        // 启动
        console.log('启动');
        setLuckyOne(null);
        setSpeed(initialSpeed);
      }

      prevStarted.current = started;
    }
  }, [started, findLuckyOne])


  useEffect(() => {
    if (speed === 0) {
      return;
    }
    const timer = setInterval(() => {
      setY((prev) => {
        let newy = prev += speed;
        if (newy > 0) {
          newy = -nameList.length * singleHeight + newy;
        }
        console.log('speed: ' + speed + ', prev y: ' + prev + ', new y: ' + newy)
        return newy;
      });
    }, 16);
    return () => {
      window.clearInterval(timer);
    };
  }, [speed, nameList.length]);
  return (
    <div
      className="App"
      style={{ height: containerHeight, overflow: "hidden" }}
    >
      <div style={{ transform: `translateY(${y}px)` }}>
        {cycleNameList.map((item) => (
          <NameItem key={item.id} name={item.name} />
        ))}
      </div>
      {!!luckyOne && <CongraModal person={luckyOne} awardRank={awardRank} />}
      <div className='list-middle' />
    </div>
  );
}
