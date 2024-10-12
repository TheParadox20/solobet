export default function P2EIcon({sport,classname}){
    const sportIcons = {
        "Prediction Market": "icon-[bi--graph-up]",
        "Gamers\' Lounge": "icon-[solar--gamepad-charge-linear]",
        "Casino": "icon-[game-icons--fire-ace]",
      };
      return <span className={`${sportIcons[sport]} ${classname}`}/>
}