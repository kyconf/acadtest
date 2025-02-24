import React from 'react';


const ExamHeader = () => {
    const [showCalculator, setShowCalculator] = useState(false); // State to toggle the calculator

    const toggleCalculator = () => {
        if (!window.Desmos) {
          console.error("Desmos library is not loaded.");
          return;
        }
    
        setShowCalculator((prev) => !prev); // Toggle the visibility of the calculator
      };
    
    
      useEffect(() => {
        let calculator;
        if (showCalculator && window.Desmos) {
          calculator = window.Desmos.GraphingCalculator(calculatorRef.current, {
            expressions: true,
            settingsMenu: true,
          });
    
        }
    
        return () => {
          if (calculator) {
            calculator.destroy();
          }
        };
      }, [showCalculator]); // Run this effect when `showCalculator` changes

  return (
    <div className={styles.main}>
    <div className={styles.examHeader}>
        <div className={styles.sectionInfo}>
          <h2>Section {currentQ[`section_id`]}, Module {currentQ[`module_id`]}: {currentQ[`module_name`]}</h2>
         
        </div>
        <div className={styles.examTools}>
          <div className={styles.timer}>  <div className={styles.timerWrapper}><Timer /></div><button className={styles.hideButton}>Hide</button></div>
          
          <button className={styles.toolButton}>
            <span>✎</span>
            Annotate
          </button>
          <button onClick={toggleCalculator} className={styles.toolButton}>
          🖩 Calculator
          </button>

          
        </div>
      </div>
    </div>
  );
};

export default ExamHeader;