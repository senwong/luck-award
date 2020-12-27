import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
// import origin from "./nameList.json";
import CongraModal from './CongraModal';

const origin = Array(600).fill(1);

const originData = origin.slice(0, 20)
  .map((name, index) => ({ name: index, id: index }));

const singleHeight = 50;

const initialSpeed = 8;



function NameItem({ name, isLucky }) {
  const cls = "name-item".concat(' ', isLucky ? 'name-item__lucky' : '');
  return <div className={cls}>{name}</div>;
}


const containerHeight = 650;


// 整个循环显示的list需要2n+1项
function generateCycleData(data) {
  return data
  .slice(-1)
  .map((item) => ({ ...item, cycleId: "top-top-" + item.id })) // 1 项
  .concat(data.map((item) => ({ ...item, cycleId: "top-" + item.id }))) // n 项
  .concat(data.map((item) => ({ ...item, cycleId: item.id }))); // n 项
}

export default function App() {
  // 人员名单，{ name, id }
  const [nameList, setNameList] = useState(originData);
  const [y, setY] = useState(-(originData.length + 1) * singleHeight); // y始终是负的
  const [started, setStarted] = useState(false);
  const prevStarted = useRef(false);
  const [speed, setSpeed] = useState(0);
	const luckyOneRef = useRef();
	const [showCongraModal, setShowCongraModal] = useState(false);
  const [awardRank, setAwardRank] = useState(0);

  const cycleNameList = useMemo(() => {
    return generateCycleData(nameList);
  }, [nameList]);


  const findLuckyOne = useCallback(() => {
    let luckyOneIndex = Math.floor(Math.abs(y - (containerHeight / 2)) / singleHeight);
    console.log('findLuckyOne, y: ' + y + ', luckyOneIndex: ' + luckyOneIndex)
    const luckyOne = cycleNameList[luckyOneIndex];
    setAwardRank(rank => {
      console.log('setAwardRank ' + rank + 1)
      return rank + 1;
		});
		setShowCongraModal(true);
		luckyOneRef.current = luckyOne
  }, [y, cycleNameList]);

  // 监听事件，改变started
  useEffect(() => {
    const handleSpaceDown = (event) => {
      if (event.code === "Space") {
        if (showCongraModal) {
          setShowCongraModal(false);
          // 清空已中奖的id
          setNameList(prev => prev.filter(item => item.id !== luckyOneRef.current?.id));
        } else {
          setStarted((prev) => !prev);
        }
      }
    };
    window.addEventListener("keydown", handleSpaceDown);
    return () => {
      window.removeEventListener("keydown", handleSpaceDown);
    };
  }, [showCongraModal]);
  
  // 用 started 控制 speed
  useEffect(() => {
    if (started !== prevStarted.current) {
      if (!started && prevStarted.current) {
        // 停止
        console.log('按下停止按钮停止，逐渐减缓速度');
        const timer = setInterval(() => {
          setSpeed(prev => {
            if (prev === 1) {
              window.clearInterval(timer)
            }
            return Math.max(0, prev - 1);
          });
        }, 100);
   
      } else if (started && !prevStarted.current) {
        // 启动
        console.log('按下启动');
        setSpeed(initialSpeed);
      }

      prevStarted.current = started;
    }
  }, [started])


  // 检测speed的变化，
  // if previous speed > 0 && current speed === 0 , it stopped
  const prevSpeed = useRef(speed);
  useEffect(() => {
    if (prevSpeed.current !== speed) {
      if (prevSpeed.current > 0 && speed === 0) {
        findLuckyOne();
      }
      prevSpeed.current = speed;
    }
  }, [speed, findLuckyOne]);


  // 用 speed 控制位移 y
  useEffect(() => {
    if (speed === 0) {
      return;
    }
    const timer = setInterval(() => {
      setY((prev) => {
        let newy = prev + speed;
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
          <NameItem key={item.cycleId} name={item.name} isLucky={luckyOneRef.current && luckyOneRef.current.id === item.id} />
        ))}
      </div>
      <CongraModal show={showCongraModal} person={luckyOneRef.current} awardRank={awardRank} />
    </div>
  );
}
