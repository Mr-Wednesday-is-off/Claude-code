import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChevronLeft, ChevronDown, Car, Users, Home, Scale, FileWarning, Search, BookOpen, CheckCircle, AlertTriangle, Shield, Camera } from "lucide-react";

// Progress Component
const ProgressBar = ({ completed, total }) => {
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
      <div 
        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
        style={{ width: `${percentage}%` }}
      />
      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
        {completed} of {total} sections explored
      </div>
    </div>
  );
};

// Quick Actions Component
const QuickActions = ({ onQuickAction }) => {
  const quickActions = [
    { icon: AlertTriangle, text: "Emergency Rights", color: "bg-red-100 text-red-800", section: "rights" },
    { icon: Car, text: "Traffic Stop", color: "bg-blue-100 text-blue-800", section: "vehicle" },
    { icon: Users, text: "Street Stop", color: "bg-green-100 text-green-800", section: "street" },
    { icon: Home, text: "Home Visit", color: "bg-yellow-100 text-yellow-800", section: "home" }
  ];

  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {quickActions.map((action, index) => (
        <div 
          key={index} 
          onClick={() => onQuickAction(action.section)}
          className={`${action.color} rounded-lg p-3 flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform`}
        >
          <action.icon className="h-5 w-5" />
          <span className="text-sm font-medium">{action.text}</span>
        </div>
      ))}
    </div>
  );
};

// Search Component
const SearchBar = ({ query, setQuery, onSearch }) => (
  <div className="relative mb-6">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
    <input
      type="text"
      placeholder="Search rights, procedures, or ask a question..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyPress={(e) => e.key === 'Enter' && onSearch()}
      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl
                 focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none
                 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                 placeholder-gray-500 dark:placeholder-gray-400 text-sm"
    />
  </div>
);

// Enhanced Accordion
const Accordion = ({ title, children, isImportant = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`border-2 rounded-lg mb-4 ${isImportant ? 'border-purple-200 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-lg"
      >
        <span className={`font-medium ${isImportant ? 'text-purple-800 dark:text-purple-200' : 'text-gray-900 dark:text-gray-100'}`}>
          {title}
        </span>
        <ChevronDown className={`transform transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"} ${isImportant ? 'text-purple-600' : 'text-gray-500'}`} />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 text-gray-700 dark:text-gray-300">
          {children}
        </div>
      )}
    </div>
  );
};

// Main App Component
const LawEnforcementInteraction = () => {
  const [activeTab, setActiveTab] = useState("vehicle");
  const [currentStep, setCurrentStep] = useState({
    vehicle: "initial",
    street: "initial", 
    home: "initial",
    ice: "initial",
    rights: "initial"
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [completedSections, setCompletedSections] = useState(new Set());

  const markSectionCompleted = useCallback((section) => {
    setCompletedSections(prev => {
      const newSet = new Set(prev);
      newSet.add(section);
      return newSet;
    });
  }, []);

  const handleQuickAction = (section) => {
    // Ensure we have a valid section
    if (scenarios[section] && scenarios[section]["initial"]) {
      setActiveTab(section);
      setCurrentStep(prev => ({ ...prev, [section]: "initial" }));
    }
  };

  const scenarios = {
    vehicle: {
      initial: {
        title: "Vehicle Interaction",
        content: (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Are you the driver or a passenger?</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Your rights and responsibilities differ based on your role in the vehicle.</p>
              <div className="grid gap-4">
                <Button
                  onClick={() => {
                    setCurrentStep({ ...currentStep, vehicle: "driver" });
                    markSectionCompleted("vehicle-driver");
                  }}
                  className="h-auto py-6 px-6 text-left justify-start bg-white dark:bg-gray-800 border-2 border-blue-200 hover:border-blue-400 text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  variant="outline"
                >
                  <div className="flex items-center gap-4">
                    <Car className="h-8 w-8 text-blue-600" />
                    <div>
                      <div className="font-semibold text-lg">I'm the Driver</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Learn your rights and responsibilities as the driver</div>
                    </div>
                  </div>
                </Button>
                <Button
                  onClick={() => {
                    setCurrentStep({ ...currentStep, vehicle: "passenger" });
                    markSectionCompleted("vehicle-passenger");
                  }}
                  className="h-auto py-6 px-6 text-left justify-start bg-white dark:bg-gray-800 border-2 border-green-200 hover:border-green-400 text-gray-900 dark:text-gray-100 hover:bg-green-50 dark:hover:bg-green-900/20"
                  variant="outline"
                >
                  <div className="flex items-center gap-4">
                    <Users className="h-8 w-8 text-green-600" />
                    <div>
                      <div className="font-semibold text-lg">I'm a Passenger</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Understand your specific rights as a passenger</div>
                    </div>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        )
      },
      driver: {
        title: "Driver Rights & Procedures",
        content: (
          <div className="space-y-6">
            <Button 
              onClick={() => setCurrentStep({ ...currentStep, vehicle: "initial" })}
              variant="ghost" 
              className="mb-4 text-purple-600 hover:text-purple-800"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Vehicle Options
            </Button>
            
            <Accordion title="🚗 If You're Stopped as a Driver" isImportant={true}>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border-l-4 border-red-400">
                    <h4 className="font-bold text-red-800 dark:text-red-200 mb-2">Immediate Actions</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Pull over safely and turn off engine</li>
                      <li>• Turn on interior light if dark</li>
                      <li>• Keep hands visible on steering wheel</li>
                      <li>• Stay calm and move slowly</li>
                      <li>• Begin recording if possible</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-400">
                    <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-2">Required Documents</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Driver's license</li>
                      <li>• Vehicle registration</li>
                      <li>• Proof of insurance</li>
                      <li className="font-semibold">• Nothing else is required</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <h4 className="font-bold text-purple-800 dark:text-purple-200 mb-3">Your Constitutional Rights During the Stop</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="font-semibold mb-2">You Have the Right To:</h5>
                      <ul className="space-y-2">
                        <li>• Remain silent <span className="text-xs">(5th Amendment)</span></li>
                        <li>• Refuse searches <span className="text-xs">(4th Amendment)</span></li>
                        <li>• Record the interaction <span className="text-xs">(1st Amendment)</span></li>
                        <li>• Ask if you're free to go</li>
                        <li>• Request a supervisor</li>
                        <li>• Get badge numbers & names</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold mb-2">NOT Recommended:</h5>
                      <ul className="space-y-2 text-red-700 dark:text-red-300">
                        <li>✗ Answering investigative questions (can only hurt, never help you)</li>
                        <li>✗ Trying to "explain" or "clear things up"</li>
                        <li>✗ Consenting to any searches</li>
                        <li>✗ Admitting to anything</li>
                        <li>✗ Arguing or debating</li>
                        <li>✗ Making sudden movements</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border-l-4 border-amber-400">
                  <h4 className="font-bold text-amber-800 dark:text-amber-200 mb-2">If Asked to Exit Vehicle</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="font-semibold">• You must comply with the order to exit</li>
                    <li>• Close and lock your door behind you</li>
                    <li>• You are NOT required to allow re-entry to the vehicle</li>
                    <li>• State: "I do not consent to any searches of my vehicle"</li>
                    <li>• Keep your keys with you</li>
                  </ul>
                </div>
              </div>
            </Accordion>

            <Accordion title="⚖️ What to Say - Constitutional Invocations" isImportant={true}>
              <div className="space-y-4">
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border-l-4 border-red-400">
                  <h4 className="font-bold text-red-800 dark:text-red-200 mb-2">⚠️ Critical Legal Reality</h4>
                  <p className="text-sm font-semibold mb-2">Your statements to police can ONLY hurt you, never help you:</p>
                  <ul className="space-y-1 text-sm">
                    <li>• Anything you say CAN be used against you in court</li>
                    <li>• Anything you say in your defense CANNOT be used to help you (it's hearsay)</li>
                    <li>• There is NO legal benefit to explaining yourself to police</li>
                    <li>• Even truthful statements can be misremembered or twisted</li>
                  </ul>
                </div>
                
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                  <h4 className="font-bold text-indigo-800 dark:text-indigo-200 mb-2">Proper Legal Invocations</h4>
                  <ul className="space-y-2 text-sm italic">
                    <li>"I invoke and do not waive my 5th Amendment right to remain silent"</li>
                    <li>"I invoke and do not waive my 4th Amendment right against unreasonable searches"</li>
                    <li>"I do not consent to any searches of my person, vehicle, or belongings"</li>
                    <li>"Am I being detained or am I free to go?"</li>
                    <li>"I will not answer questions without an attorney present"</li>
                    <li>"I am exercising my 1st Amendment right to record this interaction"</li>
                  </ul>
                </div>
              </div>
            </Accordion>
            
            <Accordion title="📱 Recording & Documentation Rights">
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h4 className="font-bold text-green-800 dark:text-green-200 mb-2">Recording is Your Right</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="font-semibold">• Recording police interactions is protected by the 1st Amendment</li>
                    <li>• Use dash cam or phone mount (hands-free)</li>
                    <li>• You don't need to inform officers you're recording</li>
                    <li>• Officers cannot legally order you to stop recording</li>
                    <li>• Never unlock phone without a warrant</li>
                    <li>• Upload/backup recordings immediately</li>
                  </ul>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                  <h4 className="font-bold text-yellow-800 dark:text-yellow-200 mb-2">Document Everything</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Officer names and badge numbers</li>
                    <li>• Patrol car numbers</li>
                    <li>• Time, date, and exact location</li>
                    <li>• Reason given for stop</li>
                    <li>• Any threats or promises made</li>
                    <li>• Witness contact information</li>
                  </ul>
                </div>
              </div>
            </Accordion>
          </div>
        )
      },
      passenger: {
        title: "Passenger Rights & Procedures", 
        content: (
          <div className="space-y-6">
            <Button 
              onClick={() => setCurrentStep({ ...currentStep, vehicle: "initial" })}
              variant="ghost" 
              className="mb-4 text-purple-600 hover:text-purple-800"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Vehicle Options
            </Button>
            
            <Accordion title="👥 Passenger Constitutional Rights" isImportant={true}>
              <div className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-400">
                  <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-3">Key Passenger Rights</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>NO ID required unless suspected of specific crime <span className="text-xs">(4th Amendment)</span></span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Right to remain silent <span className="text-xs">(5th Amendment)</span></span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Can refuse searches even if driver consents <span className="text-xs">(4th Amendment)</span></span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Right to record the interaction <span className="text-xs">(1st Amendment)</span></span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Can leave on foot unless detained <span className="text-xs">(4th Amendment)</span></span>
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <h4 className="font-bold text-purple-800 dark:text-purple-200 mb-2">Proper Invocations</h4>
                    <ul className="space-y-1 text-sm italic">
                      <li>"I invoke my 5th Amendment right to remain silent"</li>
                      <li>"I do not consent to any searches"</li>
                      <li>"Am I free to leave?"</li>
                      <li>"What specific crime am I suspected of?"</li>
                      <li>"I need to speak with an attorney"</li>
                    </ul>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                    <h4 className="font-bold text-orange-800 dark:text-orange-200 mb-2">If Ordered to Exit</h4>
                    <ul className="space-y-1 text-sm">
                      <li className="font-semibold">• You must comply with the order</li>
                      <li>• Take ALL belongings with you</li>
                      <li>• Close and lock door behind you</li>
                      <li>• Step away from the vehicle</li>
                      <li>• State: "I do not consent to any searches"</li>
                      <li>• Ask: "Am I being detained or am I free to leave?"</li>
                      <li>• Record if possible</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                  <h4 className="font-bold text-yellow-800 dark:text-yellow-200 mb-2">🚶 Passenger-Specific Rights</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Unless detained for a specific crime, passengers can usually leave on foot</li>
                    <li>• You are NOT responsible for the driver's violations</li>
                    <li>• Your belongings are separate - driver cannot consent to search YOUR bag</li>
                    <li>• If police find something illegal that's not yours, do NOT claim ownership</li>
                    <li>• You can refuse to answer questions about the driver</li>
                  </ul>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <h4 className="font-bold text-red-800 dark:text-red-200 mb-2">⚠️ Important: Not Recommended</h4>
                  <ul className="space-y-1 text-sm">
                    <li>✗ Answering questions about where you're going/coming from</li>
                    <li>✗ Providing ID unless legally required</li>
                    <li>✗ Consenting to any searches</li>
                    <li>✗ Making statements about the driver or situation</li>
                    <li>✗ Reaching for anything without announcing it first</li>
                    <li>✗ Arguing or interfering with the driver's interaction</li>
                  </ul>
                </div>
              </div>
            </Accordion>

            <Accordion title="📱 Recording as a Passenger">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h4 className="font-bold text-green-800 dark:text-green-200 mb-2">Your Right to Record:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• You have a 1st Amendment right to record</li>
                  <li>• Record quietly without interfering</li>
                  <li>• You don't need to announce you're recording</li>
                  <li>• Keep phone visible to avoid "reaching" concerns</li>
                  <li>• Upload/stream immediately if possible</li>
                </ul>
              </div>
            </Accordion>
          </div>
        )
      }
    },
    street: {
      initial: {
        title: "Street Interactions",
        content: (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4">Street Stop Rights in New York</h2>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-l-4 border-green-400">
                <h3 className="font-bold text-green-800 dark:text-green-200 mb-2">🔹 New York is NOT a "Stop and Identify" State</h3>
                <p className="text-sm mb-4 text-gray-600 dark:text-gray-300">You are not required to show ID just because an officer asks. They need reasonable suspicion of a crime.</p>
                <div className="space-y-2 text-gray-800 dark:text-gray-200">
                  <div>✓ "Am I free to go?" <span className="text-xs">(4th Amendment - freedom from detention)</span></div>
                  <div>✓ "I invoke my 5th Amendment right to remain silent"</div>
                  <div>✓ "What crime am I suspected of?"</div>
                  <div>✓ "I am exercising my 1st Amendment right to record"</div>
                </div>
              </div>
            </div>

            <Accordion title="⚖️ Constitutional Rights on the Street" isImportant={true}>
              <div className="space-y-3">
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <h4 className="font-bold text-purple-800 dark:text-purple-200 mb-2">Your Rights During Street Stops</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>4th Amendment:</strong> Protection from unreasonable detention - you cannot be detained without reasonable suspicion</li>
                    <li>• <strong>5th Amendment:</strong> You don't have to answer any questions</li>
                    <li>• <strong>1st Amendment:</strong> Right to record police in public spaces</li>
                    <li>• You can walk away unless told you're being detained</li>
                    <li>• You can refuse consent to searches</li>
                  </ul>
                </div>
                
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <h4 className="font-bold text-red-800 dark:text-red-200 mb-2">⚠️ Remember: Explanations Can't Help You</h4>
                  <p className="text-sm">
                    Your explanations to police are inadmissible hearsay if you try to use them in your defense, 
                    but CAN be used against you as evidence. There's no legal benefit to explaining yourself on the street.
                  </p>
                </div>
              </div>
            </Accordion>

            <Accordion title="📱 Recording Your Interaction" isImportant={true}>
              <div className="space-y-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-2">Recording is Strongly Recommended</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="font-semibold">• Recording police is a 1st Amendment protected activity</li>
                    <li>• You can record officers performing duties in public</li>
                    <li>• Keep a safe, non-interfering distance</li>
                    <li>• You don't have to stop recording if asked</li>
                    <li>• Officers cannot legally delete your recordings</li>
                    <li>• Immediately backup/stream recordings to cloud</li>
                  </ul>
                </div>
              </div>
            </Accordion>

            <Accordion title="🛑 Terry Stops and Your Rights">
              <div className="space-y-3">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                  <h4 className="font-bold text-yellow-800 dark:text-yellow-200 mb-2">Understanding Terry Stops</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Police need "reasonable suspicion" to detain you</li>
                    <li>• Pat-downs are only for weapons, not general searches</li>
                    <li>• You can refuse consent to searches beyond pat-down</li>
                    <li>• Ask: "Am I being detained or am I free to go?"</li>
                    <li>• If free to go, you can leave immediately</li>
                  </ul>
                </div>
              </div>
            </Accordion>
          </div>
        )
      }
    },
    home: {
      initial: {
        title: "Home Visits",
        content: (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4">Police at Your Home</h2>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-l-4 border-yellow-400">
                <h3 className="font-bold text-yellow-800 dark:text-yellow-200 mb-2">🏠 Your 4th Amendment Castle Doctrine Rights</h3>
                <p className="text-sm mb-4 text-gray-600 dark:text-gray-300">Your home has the strongest Fourth Amendment protections against unreasonable searches.</p>
                <div className="space-y-2 text-gray-800 dark:text-gray-200">
                  <div>✓ You don't have to open the door</div>
                  <div>✓ You can speak through the closed door</div>
                  <div>✓ Demand to see a warrant signed by a judge</div>
                  <div>✓ Record through doorbell camera or window</div>
                  <div>✓ You can remain completely silent</div>
                </div>
              </div>
            </div>

            <Accordion title="⚖️ Constitutional Protections at Home" isImportant={true}>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                <h4 className="font-bold text-indigo-800 dark:text-indigo-200 mb-2">What to Say Through the Door</h4>
                <ul className="space-y-1 text-sm italic">
                  <li>"I invoke my 4th Amendment right against unreasonable searches"</li>
                  <li>"I do not consent to any entry or searches"</li>
                  <li>"Please show me a warrant signed by a judge"</li>
                  <li>"I invoke my 5th Amendment right to remain silent"</li>
                  <li>"I will not open the door without a valid warrant"</li>
                </ul>
              </div>
            </Accordion>

            <Accordion title="🚪 When They Can Enter Without Your Permission" isImportant={true}>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <h4 className="font-bold text-red-800 dark:text-red-200 mb-2">Limited Exceptions (Very Narrow):</h4>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Valid Search Warrant:</strong> Must be signed by a judge, not just police</li>
                  <li>• <strong>Hot Pursuit:</strong> Chasing someone who just committed a crime</li>
                  <li>• <strong>Immediate Danger:</strong> Someone inside is in immediate peril</li>
                  <li>• <strong>Destruction of Evidence:</strong> Very limited and specific circumstances</li>
                </ul>
                <p className="text-xs mt-3 font-semibold">Note: "We just want to talk" or "We're investigating" are NOT valid reasons for entry</p>
              </div>
            </Accordion>

            <Accordion title="📋 Warrant Requirements">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-2">Valid Warrant Must Have:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Judge's signature (not just police)</li>
                  <li>• Correct address</li>
                  <li>• Specific items or persons being sought</li>
                  <li>• Recent date (not expired)</li>
                  <li>• Ask them to slip it under the door or show through window</li>
                </ul>
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded mt-3">
                  <p className="text-xs font-semibold text-red-800 dark:text-red-200">⚠️ IMPORTANT: An arrest warrant for a person does NOT grant entry to a home unless they have reasonable belief the person is inside AND it's that person's residence</p>
                </div>
              </div>
            </Accordion>

            <Accordion title="⚠️ NEVER Open Your Door" isImportant={true}>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <h4 className="font-bold text-red-800 dark:text-red-200 mb-2">Why Opening the Door is Dangerous:</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Officers may put their foot in to prevent closing</li>
                  <li>• They may claim to "see" or "smell" something as probable cause</li>
                  <li>• Opening creates opportunity for forced entry</li>
                  <li>• You can be arrested if you step outside</li>
                  <li className="font-semibold">• ALWAYS speak through the closed door</li>
                  <li className="font-semibold">• Warrants can be slipped under the door if needed</li>
                </ul>
              </div>
            </Accordion>
          </div>
        )
      }
    },
    ice: {
      initial: {
        title: "ICE Interactions",
        content: (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4">ICE Encounters</h2>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-l-4 border-purple-400">
                <h3 className="font-bold text-purple-800 dark:text-purple-200 mb-2">⚖️ Constitutional Rights Apply to Everyone</h3>
                <p className="text-sm mb-4 text-gray-600 dark:text-gray-300">Regardless of immigration status, the Constitution protects you.</p>
                <div className="space-y-2 text-gray-800 dark:text-gray-200">
                  <div>✓ 5th Amendment right to remain silent</div>
                  <div>✓ 4th Amendment right against unreasonable searches</div>
                  <div>✓ 6th Amendment right to an attorney</div>
                  <div>✓ Do not sign anything without an attorney</div>
                  <div>✓ Right to refuse entry without judicial warrant</div>
                </div>
              </div>
            </div>

            <Accordion title="📋 If ICE Comes to Your Home" isImportant={true}>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-2">Critical Steps:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="font-semibold">• DO NOT open the door</li>
                  <li>• Ask: "Do you have a warrant signed by a judge?"</li>
                  <li>• <strong>Administrative warrants (Form I-200, I-205) are NOT sufficient for entry</strong></li>
                  <li>• Only a judicial warrant (signed by a judge) allows entry</li>
                  <li>• Say: "I do not consent to entry"</li>
                  <li>• Say: "I invoke my right to remain silent"</li>
                  <li>• Have emergency contacts and attorney info ready</li>
                  <li>• Document everything, record if possible</li>
                </ul>
              </div>
            </Accordion>

            <Accordion title="⚖️ Know Your Rights Statements">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h4 className="font-bold text-purple-800 dark:text-purple-200 mb-2">What to Say:</h4>
                <ul className="space-y-1 text-sm italic">
                  <li>"I invoke my 5th Amendment right to remain silent"</li>
                  <li>"I do not consent to any entry or searches"</li>
                  <li>"I will not sign anything without an attorney"</li>
                  <li>"I am exercising my right to an attorney"</li>
                  <li>"Show me a warrant signed by a federal judge"</li>
                </ul>
              </div>
            </Accordion>
          </div>
        )
      }
    },
    rights: {
      initial: {
        title: "Your Constitutional Rights in Police Encounters",
        content: (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4">Constitutional Rights During Law Enforcement Interactions</h2>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-l-4 border-indigo-400">
                <h3 className="font-bold text-indigo-800 dark:text-indigo-200 mb-2">📜 Key Amendments in Police Encounters</h3>
                <div className="space-y-3 text-sm text-gray-800 dark:text-gray-200">
                  <div>
                    <strong>1st Amendment:</strong> Right to record police, freedom of speech, assembly
                    <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">• You can record any police interaction in public spaces</p>
                  </div>
                  <div>
                    <strong>4th Amendment:</strong> Protection from unreasonable searches and seizures
                    <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">• Requires warrant or probable cause for searches</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">• Protects against unlawful detention</p>
                  </div>
                  <div>
                    <strong>5th Amendment:</strong> Right to remain silent, protection against self-incrimination
                    <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">• You cannot be forced to answer questions</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">• Must be clearly invoked to be effective</p>
                  </div>
                  <div>
                    <strong>6th Amendment:</strong> Right to an attorney
                    <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">• Applies during custodial interrogation</p>
                  </div>
                </div>
              </div>
            </div>

            <Accordion title="⚡ Critical Phrases for Any Police Encounter" isImportant={true}>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h4 className="font-bold text-purple-800 dark:text-purple-200 mb-2">Say These Clearly and Calmly:</h4>
                <ul className="space-y-2 text-sm italic">
                  <li>"I invoke and do not waive my 5th Amendment right to remain silent"</li>
                  <li>"I invoke and do not waive my 4th Amendment rights"</li>
                  <li>"I do not consent to any searches"</li>
                  <li>"Am I free to leave?"</li>
                  <li>"I will not answer questions without an attorney present"</li>
                  <li>"I am exercising my 1st Amendment right to record"</li>
                  <li>"May I have your name and badge number?"</li>
                  <li>"I would like to speak with a supervisor"</li>
                </ul>
              </div>
            </Accordion>

            <Accordion title="⚠️ Why You Should NEVER Explain Yourself" isImportant={true}>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <h4 className="font-bold text-red-800 dark:text-red-200 mb-2">The Legal Asymmetry - Statements Can Only Hurt You:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="font-semibold">• Your statements CAN be used AGAINST you in court</li>
                  <li className="font-semibold">• Your statements CANNOT be used to HELP you (they're hearsay)</li>
                  <li>• Even truthful explanations can be twisted or misremembered</li>
                  <li>• "Clearing things up" with police has no legal benefit</li>
                  <li>• Innocent explanations can accidentally provide probable cause</li>
                  <li>• Your defense belongs in court with your attorney, not on the street</li>
                </ul>
                <p className="text-xs mt-3 font-semibold bg-red-100 dark:bg-red-900/30 p-2 rounded">
                  REMEMBER: There is literally NO legal advantage to explaining yourself to police. Save your defense for court where it can actually help you.
                </p>
              </div>
            </Accordion>

            <Accordion title="🚫 What NOT to Do (Protecting Your Rights)">
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <h4 className="font-bold text-red-800 dark:text-red-200 mb-2">Never Recommended:</h4>
                <ul className="space-y-1 text-sm">
                  <li>✗ Answering questions during an investigation</li>
                  <li>✗ Trying to "explain your side" (it's hearsay and can't help you in court)</li>
                  <li>✗ Consenting to any searches</li>
                  <li>✗ Providing information beyond ID when required</li>
                  <li>✗ Making statements about where you've been or are going</li>
                  <li>✗ Trying to talk your way out of a situation</li>
                  <li>✗ Physically resisting (even unlawful arrests)</li>
                  <li>✗ Arguing law with officers on scene</li>
                  <li>✗ Signing anything without reading and understanding</li>
                </ul>
                <p className="text-xs mt-3 font-semibold">Remember: Anything you say can and will be used against you, but CANNOT be used to help you (it's hearsay)</p>
              </div>
            </Accordion>

            <Accordion title="📱 Always Document Everything">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h4 className="font-bold text-green-800 dark:text-green-200 mb-2">Recording and Documentation Rights:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Recording police is a 1st Amendment protected activity</li>
                  <li>• Get badge numbers, names, patrol car numbers</li>
                  <li>• Note exact time, date, location</li>
                  <li>• Get witness contact information</li>
                  <li>• Save/backup recordings immediately</li>
                  <li>• Write down everything while memory is fresh</li>
                  <li>• Take photos of any injuries or damage</li>
                </ul>
              </div>
            </Accordion>

            <Accordion title="⚖️ After the Encounter">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <h4 className="font-bold text-yellow-800 dark:text-yellow-200 mb-2">Protecting Your Rights After:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• File complaints for rights violations</li>
                  <li>• Contact civil rights attorneys</li>
                  <li>• Preserve all evidence and recordings</li>
                  <li>• Get medical attention if needed (document injuries)</li>
                  <li>• Don't post on social media until consulting attorney</li>
                  <li>• Request body cam footage (time limits apply)</li>
                </ul>
              </div>
            </Accordion>

            <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-gray-300 dark:border-gray-600">
              <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
                <Scale className="h-5 w-5" />
                Important Legal Notice
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                This app provides general information about legal rights in the United States. It is not legal advice, 
                and no attorney-client relationship is created. Laws may vary by state and jurisdiction. Constitutional 
                rights described here are based on federal law, but state and local laws may provide additional protections 
                or requirements. For legal advice specific to your situation, consult a licensed attorney in your jurisdiction. 
                If you are arrested or charged with a crime, seek legal counsel immediately.
              </p>
            </div>
          </div>
        )
      }
    }
  };

  const tabIcons = {
    vehicle: Car,
    street: Users,
    home: Home,
    ice: FileWarning,
    rights: Shield
  };

  const currentScenario = scenarios[activeTab]?.[currentStep[activeTab]];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <Card className="w-full max-w-4xl mx-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold">Constitutional Rights Guide</CardTitle>
              <CardDescription className="text-purple-100 text-lg">
                Know Your Rights During Law Enforcement Encounters
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8" />
            </div>
          </div>
          <div className="mt-4 p-3 bg-black/20 rounded-lg">
            <p className="text-xs text-purple-100">
              <strong>Legal Disclaimer:</strong> This app provides general information about legal rights in the United States. 
              It is not legal advice, and no attorney-client relationship is created. Laws may vary by state. 
              For legal advice specific to your situation, consult a licensed attorney.
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="pt-8 px-8">
          <div className="space-y-8">
            <ProgressBar completed={completedSections.size} total={10} />
            <SearchBar query={searchQuery} setQuery={setSearchQuery} onSearch={() => {}} />
            <QuickActions onQuickAction={handleQuickAction} />
            
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Choose Your Situation</h3>
              <Tabs value={activeTab} onValueChange={(value) => {
                setActiveTab(value);
                setCurrentStep(prev => ({ ...prev, [value]: "initial" }));
              }} className="space-y-6">
                <TabsList className="grid w-full grid-cols-5 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                  {Object.entries(tabIcons).map(([value, Icon]) => (
                    <TabsTrigger
                      key={value}
                      value={value}
                      className="flex items-center gap-2 py-3 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline capitalize">{value === 'ice' ? 'ICE' : value === 'rights' ? 'Rights' : value}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                <TabsContent value="vehicle" className="pt-4">
                  {scenarios.vehicle?.[currentStep.vehicle]?.content || <div className="text-center py-12 text-gray-500">Content loading...</div>}
                </TabsContent>
                <TabsContent value="street" className="pt-4">
                  {scenarios.street?.[currentStep.street]?.content || <div className="text-center py-12 text-gray-500">Content loading...</div>}
                </TabsContent>
                <TabsContent value="home" className="pt-4">
                  {scenarios.home?.[currentStep.home]?.content || <div className="text-center py-12 text-gray-500">Content loading...</div>}
                </TabsContent>
                <TabsContent value="ice" className="pt-4">
                  {scenarios.ice?.[currentStep.ice]?.content || <div className="text-center py-12 text-gray-500">Content loading...</div>}
                </TabsContent>
                <TabsContent value="rights" className="pt-4">
                  {scenarios.rights?.[currentStep.rights]?.content || <div className="text-center py-12 text-gray-500">Content loading...</div>}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LawEnforcementInteraction;
