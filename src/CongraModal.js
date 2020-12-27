import React from "react";
import congraBg from "./congra.png";
import bg from "./bg.jpg";

import { useSpring, useTransition, animated, config } from "react-spring";

import "./congraModal.css";

const awardPool = ["IPhone", "IPhone", "IPhone", "IPhone", "IPhone"];
export default function CongraModal({ show, person, awardRank }) {
	// const animatedProps = useSpring({
	// 	from: !!person ? { transform: "translate(-50%, -50%) scale(0)", } : { transform: "translate(-50%, -50%) scale(1)", },
	// 	to: !!person ? { transform: "translate(-50%, -50%) scale(1)", } : { transform: "translate(-50%, -50%) scale(0)", },
	// 	config: !!person ? config.wobbly : config.default,
	// });

	const transitions = useTransition(show, null, {
		from: { transform: "translate(-50%, -50%) scale(0)", opacity: 0 },
		enter: { transform: "translate(-50%, -50%) scale(1)", opacity: 2 },
		leave: { transform: "translate(-50%, -50%) scale(0.5)", opacity: 0 },
		config: show ? config.wobbly : config.stiff,
	});
	return transitions.map(({ item, key, props }) =>
			item && (
				<div key={key} className="">
					<animated.div key={key} className="CongraModal__bg" style={props}>
						<div className="CongraModal__congra">
							<img className="CongraModal__congra__img" src={congraBg} alt="" />
						</div>
						<div>
							<span className="CongraModal__name">{person?.name}</span>
						</div>
						<div>
							<span className="CongraModal__award">{awardPool[awardRank]}</span>
						</div>
					</animated.div>
				</div>
			)
	);
}
