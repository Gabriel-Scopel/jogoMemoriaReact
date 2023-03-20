import { useEffect, useState } from 'react';
import * as C from './App.styles';
import logoImage from './assets/devmemory_logo.png';
import { Button } from './components/Button';
import {InfoItem} from './components/InfoItem';
import RestartIcon from './svgs/restart.svg';
import { GridItemType } from './types/GridItemType';
import {items} from './data/items';
import { GridItem } from './components/GridItem';
import { formatTimeElapsed } from './helpers/formatTimeElapsed';

const App = ()=>{
  const [playing, setPlaying] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [showCount, setShownCount] = useState<number>(0);
  const [gridItems, setGridItems] = useState<GridItemType[]>([]);

  useEffect(() => resetAndCreateGrid(), []);

  useEffect(() => {
    const timer = setInterval(()=>{
      if(playing){
        setTimeElapsed(timeElapsed+1)
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [playing, timeElapsed]);

  const resetAndCreateGrid = ()=>{
    //passo 1: resetar o jogo
    setTimeElapsed(0);
    setMoveCount(0);
    setShownCount(0);

    //passo 2: criar o grid vazio
    let tmpGrid: GridItemType[] = [];
    for(let i=0; i<(items.length*2); i++){
      tmpGrid.push({
        item:null,
        shown:false,
        permanentShown: false
      });
    }
    //2.1: preencher o grid:
    for(let w = 0; w<2 ; w++){
      for(let i = 0; i< items.length; i++){
        let pos = -1;
        while(pos < 0 || tmpGrid[pos].item !== null){
          pos = Math.floor(Math.random()*(items.length)*2);
        }
        tmpGrid[pos].item = i;
      }
    }
    //2.2: jogar no state:
    setGridItems(tmpGrid);

    //passo 3: começar o jogo
    setPlaying(true);
  }

  const handleItemclick = (index:number)=>{
if(playing && index !== null && showCount<2){
  let tmpGrid = [...gridItems];
  if (tmpGrid[index].permanentShown === false && tmpGrid[index].shown === false){
    tmpGrid[index].shown = true;
    setShownCount(showCount+1);
  }
  setGridItems(tmpGrid);
}
  }
 
  return(
    <C.Container>
      <C.Info>
        <C.LogoLink href="">
          <img src={logoImage} width="200" alt="" />
        </C.LogoLink>
        
        <C.InfoArea>
          <InfoItem label='Tempo' value={formatTimeElapsed(timeElapsed)}></InfoItem>
          <InfoItem label='Movimentos' value='0'></InfoItem>
        </C.InfoArea>
        <Button label='Reiniciar' icon={RestartIcon} onClick={resetAndCreateGrid}></Button>
      </C.Info>

      <C.GridArea>
        <C.Grid> 
          {gridItems.map((item, index)=>(
            <GridItem
            key={index}
            item={item}
            onClick={()=> handleItemclick(index)}
            />
          ))}

        </C.Grid>
      </C.GridArea>

    </C.Container>
  );
}
export default App;