import React, { useState } from 'react';

const Recommendations = ({ results }) => {
  const [expandedRecs, setExpandedRecs] = useState({});

  const toggleExpand = (index) => {
    setExpandedRecs(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Create recommendations based on assessment results
  const createRecommendations = () => {
    const recommendations = [];
    const strategies = Object.keys(results.strategies);
    
    // Add general recommendation based on overall maturity level
    switch (results.overallMaturityLevel) {
      case 0:
        recommendations.push({
          title: "Establish basic security foundations",
          description: "Your organization needs to establish foundational security controls. Focus on implementing Level 1 controls for all Essential Eight strategies, starting with the most critical gaps."
        });
        break;
      case 1:
        recommendations.push({
          title: "Progress to Level 2 maturity",
          description: "Build on your Level 1 foundations by addressing gaps in Level 2 requirements. Prioritize strategies with the lowest compliance scores."
        });
        break;
      case 2:
        recommendations.push({
          title: "Advance to Level 3 maturity",
          description: "Your organization has established good security practices. Focus now on advancing to Level 3 by implementing advanced controls, particularly for high-risk areas."
        });
        break;
      case 3:
        recommendations.push({
          title: "Maintain and enhance security posture",
          description: "Continue to maintain your strong security posture and consider enhancing beyond the Essential Eight framework with additional controls and security measures."
        });
        break;
      default:
        break;
    }
    
    // Add strategy-specific recommendations
    strategies.forEach(strategy => {
      const { maturityLevel, gaps } = results.strategies[strategy];
      const nextLevel = maturityLevel < 3 ? maturityLevel + 1 : null;
      
      if (nextLevel && gaps[nextLevel] && gaps[nextLevel].length > 0) {
        let priorityText = "";
        const compliancePercentage = results.strategies[strategy].compliance[nextLevel] || 0;
        
        if (compliancePercentage < 30) {
          priorityText = "High priority";
        } else if (compliancePercentage < 70) {
          priorityText = "Medium priority";
        } else {
          priorityText = "Low priority";
        }
        
        recommendations.push({
          title: `Improve ${strategy} (${priorityText})`,
          description: `Address ${gaps[nextLevel].length} gaps to achieve Level ${nextLevel} maturity.`,
          items: gaps[nextLevel],
          moreCount: gaps[nextLevel].length > 3 ? gaps[nextLevel].length - 3 : 0
        });
      }
    });
    
    return recommendations;
  };
  
  const recommendations = createRecommendations();
  
  return (
    <div className="space-y-4">
      {recommendations.map((rec, index) => (
        <div key={index} className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-primary mb-2">{rec.title}</h4>
          <p className="text-gray-700 mb-3">{rec.description}</p>
          
          {rec.items && rec.items.length > 0 && (
            <div className="ml-4">
              <ul className="list-disc space-y-1 text-gray-600">
                {expandedRecs[index] 
                  ? rec.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))
                  : rec.items.slice(0, 3).map((item, i) => (
                      <li key={i}>{item}</li>
                    ))
                }
                {!expandedRecs[index] && rec.moreCount > 0 && (
                  <li>
                    <button 
                      onClick={() => toggleExpand(index)}
                      className="text-primary hover:underline italic cursor-pointer"
                    >
                      And {rec.moreCount} more improvements...
                    </button>
                  </li>
                )}
                {expandedRecs[index] && rec.moreCount > 0 && (
                  <li>
                    <button 
                      onClick={() => toggleExpand(index)}
                      className="text-primary hover:underline italic cursor-pointer"
                    >
                      Show less
                    </button>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      ))}
      
      {recommendations.length === 0 && (
        <div className="text-center italic text-gray-500">
          No specific recommendations available.
        </div>
      )}
    </div>
  );
};

export default Recommendations;