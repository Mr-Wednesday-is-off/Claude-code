import { Button } from "@/components/ui/button";
import { ChevronLeft, Car, Users, Scale, CheckCircle, AlertTriangle } from "lucide-react";
import { Accordion, SectionHeader } from "./components/primitives";

// All guide content, written in English. Other languages are produced by
// looking each piece of text up in src/locales/<lang>.json (see i18n.jsx).
// After editing text here, run `npm run i18n:check` to list what needs translating.
export function getSectionContent(section, currentStep, navigate) {
  // --- Vehicle Section ---
  const renderVehicleInitial = () => (
    <div className="space-y-6">
      <div className="bg-blue-900/20 light:bg-blue-50 rounded-xl p-4 sm:p-6">
        <SectionHeader>
          <h2 className="text-2xl font-bold mb-4 text-text-primary">Are you the driver or a passenger?</h2>
        </SectionHeader>
        <p className="text-text-muted mb-6">Your rights and responsibilities differ based on your role in the vehicle.</p>
        <div className="grid gap-4">
          <Button
            onClick={() => navigate('/vehicle/driver')}
            className="h-auto w-full whitespace-normal py-5 px-4 sm:px-6 text-left justify-start bg-surface border border-border-subtle hover:border-accent-gold/50 text-text-primary hover:bg-surface-hover"
            variant="outline"
          >
            <div className="flex items-center gap-4">
              <Car className="h-8 w-8 shrink-0 text-blue-600" />
              <div>
                <div className="font-semibold text-lg">I'm the Driver</div>
                <div className="text-sm text-text-muted">Learn your rights and responsibilities as the driver</div>
              </div>
            </div>
          </Button>
          <Button
            onClick={() => navigate('/vehicle/passenger')}
            className="h-auto w-full whitespace-normal py-5 px-4 sm:px-6 text-left justify-start bg-surface border border-border-subtle hover:border-accent-gold/50 text-text-primary hover:bg-surface-hover"
            variant="outline"
          >
            <div className="flex items-center gap-4">
              <Users className="h-8 w-8 shrink-0 text-green-600" />
              <div>
                <div className="font-semibold text-lg">I'm a Passenger</div>
                <div className="text-sm text-text-muted">Understand your specific rights as a passenger</div>
              </div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );

  const renderVehicleDriver = () => (
    <div className="space-y-6">
      <Button
        onClick={() => navigate('/vehicle')}
        variant="ghost"
        className="mb-4 text-text-muted hover:text-text-secondary"
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Vehicle Options
      </Button>

      <SectionHeader>
        <h2 className="text-2xl font-bold mb-4 text-text-primary">Driver Rights & Procedures</h2>
      </SectionHeader>

      <Accordion title="🚗 If You're Stopped as a Driver" isImportant={true}>
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-red-900/20 light:bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
              <h4 className="font-bold text-red-300 light:text-red-800 mb-2">Immediate Actions</h4>
              <ul className="space-y-1 text-sm">
                <li>• Pull over safely and turn off engine</li>
                <li>• Turn on interior light if dark</li>
                <li>• Keep hands visible on steering wheel</li>
                <li>• Stay calm and move slowly</li>
                <li>• Record hands-free if you can (dash cam or phone mount), don't reach for a phone</li>
              </ul>
            </div>
            <div className="bg-blue-900/20 light:bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <h4 className="font-bold text-blue-300 light:text-blue-800 mb-2">Required Documents</h4>
              <ul className="space-y-1 text-sm">
                <li>• Driver's license</li>
                <li>• Vehicle registration</li>
                <li>• Proof of insurance</li>
                <li className="font-semibold">• You don't have to say where you're going or coming from</li>
              </ul>
              <p className="text-xs mt-2 text-text-muted">Tell the officer where the documents are before you reach for them.</p>
            </div>
          </div>

          <div className="bg-purple-900/20 light:bg-purple-50 p-4 rounded-lg">
            <h4 className="font-bold text-purple-300 light:text-purple-800 mb-3">Your Constitutional Rights During the Stop</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-semibold mb-2">You Have the Right To:</h5>
                <ul className="space-y-2">
                  <li>• Remain silent <span className="text-xs">(5th Amendment)</span></li>
                  <li>• Refuse consent to searches <span className="text-xs">(4th Amendment)</span></li>
                  <li>• Record the interaction <span className="text-xs">(1st Amendment; NY Civil Rights Law §79-p)</span></li>
                  <li>• Ask if you're free to go once the ticket or warning is done</li>
                  <li>• Request a supervisor</li>
                  <li>• Get badge numbers & names</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold mb-2">NOT Recommended:</h5>
                <ul className="space-y-2 text-red-400 light:text-red-700">
                  <li>✗ Answering investigative questions (rarely helps, often hurts)</li>
                  <li>✗ Trying to "explain" or "clear things up"</li>
                  <li>✗ Consenting to any searches</li>
                  <li>✗ Admitting to anything</li>
                  <li>✗ Arguing or debating</li>
                  <li>✗ Making sudden movements</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-amber-900/20 light:bg-amber-50 p-4 rounded-lg border-l-4 border-amber-400">
            <h4 className="font-bold text-amber-300 light:text-amber-800 mb-2">If Asked to Exit Vehicle</h4>
            <ul className="space-y-1 text-sm">
              <li className="font-semibold">• You must comply with the order to exit</li>
              <li>• Close and lock your door behind you</li>
              <li>• State: "I do not consent to any searches of my vehicle"</li>
              <li>• Keep your keys with you</li>
            </ul>
          </div>

          <div className="bg-red-900/20 light:bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
            <h4 className="font-bold text-red-300 light:text-red-800 mb-2">If They Search Anyway</h4>
            <ul className="space-y-1 text-sm">
              <li>• If police have probable cause, they can search your car without your consent or a warrant</li>
              <li>• Say clearly that you don't consent, then step back and let it happen. Never physically resist</li>
              <li>• Your refusal still matters: it protects your right to challenge the search in court</li>
              <li>• In NYC, if NYPD searches you or your vehicle, they must offer you a business card with their name, rank and shield number (unless it ends in an arrest or summons)</li>
            </ul>
          </div>

          <div className="bg-orange-900/20 light:bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400">
            <h4 className="font-bold text-orange-300 light:text-orange-800 mb-2">⚠️ Breath & Chemical Tests Are Different</h4>
            <ul className="space-y-1 text-sm">
              <li>• Refusing consent to a search can't be used against you. Refusing a test can</li>
              <li>• NY law requires a roadside breath test when an officer asks after an accident or a traffic violation</li>
              <li>• Refusing a chemical test after a DWI arrest means losing your license for at least 1 year, plus a $500 civil penalty (first refusal)</li>
              <li>• If you were warned of the consequences, the refusal can be used as evidence against you at trial</li>
              <li className="font-semibold">• You can ask to call a lawyer first, as long as it won't delay the test</li>
            </ul>
          </div>
        </div>
      </Accordion>

      <Accordion title="⚖️ What to Say - Constitutional Invocations" isImportant={true}>
        <div className="space-y-4">
          <div className="bg-red-900/20 light:bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
            <h4 className="font-bold text-red-300 light:text-red-800 mb-2">⚠️ Critical Legal Reality</h4>
            <p className="text-sm font-semibold mb-2">Explaining yourself almost never helps, and it often hurts:</p>
            <ul className="space-y-1 text-sm">
              <li>• Anything you say CAN be used against you in court</li>
              <li>• You generally can't use your own roadside explanation to help your defense later (hearsay rules)</li>
              <li>• Even truthful statements can be misremembered or twisted</li>
              <li>• Silence alone isn't enough: say out loud that you're invoking your right</li>
              <li className="font-semibold">• Never lie. Lying to police can be a separate crime. Say nothing instead</li>
            </ul>
          </div>

          <div className="bg-indigo-900/20 light:bg-indigo-50 p-4 rounded-lg">
            <h4 className="font-bold text-indigo-300 light:text-indigo-800 mb-2">Proper Legal Invocations</h4>
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
          <div className="bg-green-900/20 light:bg-green-50 p-4 rounded-lg">
            <h4 className="font-bold text-green-300 light:text-green-800 mb-2">Recording is Your Right</h4>
            <ul className="space-y-1 text-sm">
              <li className="font-semibold">• Recording police is protected by the 1st Amendment, and in NY also by state law (Civil Rights Law §79-p)</li>
              <li>• Use dash cam or phone mount (hands-free)</li>
              <li>• You don't need to inform officers you're recording</li>
              <li>• Officers can't make you stop unless you're physically interfering</li>
              <li>• Don't unlock your phone or give your passcode. Police generally need a warrant to search it</li>
              <li>• Upload/backup recordings immediately</li>
            </ul>
          </div>
          <div className="bg-yellow-900/20 light:bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-bold text-yellow-300 light:text-yellow-800 mb-2">Document Everything</h4>
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
  );

  const renderVehiclePassenger = () => (
    <div className="space-y-6">
      <Button
        onClick={() => navigate('/vehicle')}
        variant="ghost"
        className="mb-4 text-text-muted hover:text-text-secondary"
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Vehicle Options
      </Button>

      <SectionHeader>
        <h2 className="text-2xl font-bold mb-4 text-text-primary">Passenger Rights & Procedures</h2>
      </SectionHeader>

      <Accordion title="👥 Passenger Constitutional Rights" isImportant={true}>
        <div className="space-y-6">
          <div className="bg-blue-900/20 light:bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <h4 className="font-bold text-blue-300 light:text-blue-800 mb-3">Key Passenger Rights</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>You don't have to carry or show ID as a passenger. If you're suspected of a crime or being ticketed (like for no seatbelt), give your name and address: refusing can turn a ticket into an arrest</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Right to remain silent <span className="text-xs">(5th Amendment)</span></span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Can refuse a search of your own belongings, even if the driver consents to a car search <span className="text-xs">(4th Amendment)</span></span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Right to record the interaction <span className="text-xs">(1st Amendment)</span></span>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-400 light:text-amber-600 mt-0.5 flex-shrink-0" />
                <span><strong>Don't walk away on your own.</strong> Passengers are legally detained for the whole stop. Ask "Am I free to leave?" and only go if they say yes</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-purple-900/20 light:bg-purple-50 p-4 rounded-lg">
              <h4 className="font-bold text-purple-300 light:text-purple-800 mb-2">Proper Invocations</h4>
              <ul className="space-y-1 text-sm italic">
                <li>"I invoke my 5th Amendment right to remain silent"</li>
                <li>"I do not consent to any searches"</li>
                <li>"Am I free to leave?"</li>
                <li>"What specific crime am I suspected of?"</li>
                <li>"I need to speak with an attorney"</li>
              </ul>
            </div>
            <div className="bg-orange-900/20 light:bg-orange-50 p-4 rounded-lg">
              <h4 className="font-bold text-orange-300 light:text-orange-800 mb-2">If Ordered to Exit</h4>
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

          <div className="bg-yellow-900/20 light:bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-bold text-yellow-300 light:text-yellow-800 mb-2">🚶 Passenger-Specific Rights</h4>
            <ul className="space-y-2 text-sm">
              <li>• Police can order you out of the car and can keep you there until the stop ends</li>
              <li>• You are NOT responsible for the driver's violations</li>
              <li>• The driver can't consent to a search of YOUR bag. But if police have probable cause to search the car, that can include passengers' bags</li>
              <li>• If police find something illegal that's not yours, do NOT claim ownership</li>
              <li>• You can refuse to answer questions about the driver</li>
            </ul>
          </div>

          <div className="bg-red-900/20 light:bg-red-50 p-4 rounded-lg">
            <h4 className="font-bold text-red-300 light:text-red-800 mb-2">⚠️ Important: Not Recommended</h4>
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
        <div className="bg-green-900/20 light:bg-green-50 p-4 rounded-lg">
          <h4 className="font-bold text-green-300 light:text-green-800 mb-2">Your Right to Record:</h4>
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
  );

  // --- Street Section ---
  const renderStreetInitial = () => (
    <div className="space-y-6">
      <div className="bg-green-900/20 light:bg-green-50 rounded-xl p-6">
        <SectionHeader>
          <h2 className="text-2xl font-bold mb-4 text-text-primary">Street Stop Rights in New York</h2>
        </SectionHeader>
        <div className="bg-surface rounded-lg p-4 border-l-4 border-green-400">
          <h3 className="font-bold text-green-300 light:text-green-800 mb-2">🔹 ID on the Street in New York</h3>
          <div className="text-sm mb-4 text-text-muted space-y-2">
            <p>Police can ask you questions at any time, even with no suspicion. You don't have to answer.</p>
            <p>If they reasonably suspect you of a crime, NY law lets them demand your name, address and an explanation. Refusing isn't a crime by itself, and you never have to explain your conduct.</p>
            <p className="font-semibold text-text-secondary">But if you're being given a ticket or summons, give your name and address. No photo ID is needed. If you won't identify yourself, they can arrest you instead of writing a ticket.</p>
          </div>
          <div className="space-y-2 text-text-secondary">
            <div>✓ "Am I free to go?" <span className="text-xs">(4th Amendment - freedom from detention)</span></div>
            <div>✓ "I invoke my 5th Amendment right to remain silent"</div>
            <div>✓ "What crime am I suspected of?"</div>
            <div>✓ "I am exercising my 1st Amendment right to record"</div>
          </div>
        </div>
      </div>

      <Accordion title="⚖️ Constitutional Rights on the Street" isImportant={true}>
        <div className="space-y-3">
          <div className="bg-purple-900/20 light:bg-purple-50 p-4 rounded-lg">
            <h4 className="font-bold text-purple-300 light:text-purple-800 mb-2">Your Rights During Street Stops</h4>
            <ul className="space-y-2 text-sm">
              <li>• <strong>4th Amendment:</strong> Protection from unreasonable detention - you cannot be detained without reasonable suspicion</li>
              <li>• <strong>5th Amendment:</strong> You don't have to answer any questions</li>
              <li>• <strong>1st Amendment</strong> and <strong>NY Civil Rights Law §79-p:</strong> Right to record police in public</li>
              <li>• Ask "Am I free to go?" If yes, walk away calmly. Don't run</li>
              <li>• You can refuse consent to searches</li>
              <li>• In NYC, before a consent search, NYPD must tell you the search won't happen if you refuse. If they search you, they must offer a business card (unless it ends in an arrest or summons)</li>
            </ul>
          </div>

          <div className="bg-red-900/20 light:bg-red-50 p-4 rounded-lg">
            <h4 className="font-bold text-red-300 light:text-red-800 mb-2">⚠️ Remember: Explanations Rarely Help You</h4>
            <p className="text-sm">
              What you say can be used against you, but you generally can't use your own street-corner explanation
              to help your defense later (hearsay rules). Give your name when the law requires it, otherwise stay silent. Never lie.
            </p>
          </div>
        </div>
      </Accordion>

      <Accordion title="📱 Recording Your Interaction" isImportant={true}>
        <div className="space-y-3">
          <div className="bg-blue-900/20 light:bg-blue-50 p-4 rounded-lg">
            <h4 className="font-bold text-blue-300 light:text-blue-800 mb-2">Recording is Strongly Recommended</h4>
            <ul className="space-y-1 text-sm">
              <li className="font-semibold">• Recording police is protected by the 1st Amendment and NY Civil Rights Law §79-p</li>
              <li>• You can record officers performing duties in public</li>
              <li>• Keep a safe, non-interfering distance. If told to step back, step back and keep recording</li>
              <li>• You don't have to stop recording if asked, unless you're physically interfering</li>
              <li>• Officers cannot legally delete or copy your recordings without your consent or a court order</li>
              <li>• NY's right-to-record laws don't cover police station lobbies (NY Court of Appeals, 2026)</li>
              <li>• Immediately backup/stream recordings to cloud</li>
            </ul>
          </div>
        </div>
      </Accordion>

      <Accordion title="🛑 Terry Stops and Your Rights">
        <div className="space-y-3">
          <div className="bg-yellow-900/20 light:bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-bold text-yellow-300 light:text-yellow-800 mb-2">Understanding Terry Stops</h4>
            <ul className="space-y-1 text-sm">
              <li>• Police need "reasonable suspicion" to detain you</li>
              <li>• Pat-downs are only for weapons, not general searches</li>
              <li>• You can refuse consent to searches beyond pat-down</li>
              <li>• Ask: "Am I being detained or am I free to go?"</li>
              <li>• If free to go, you can leave immediately</li>
              <li>• If you're detained, don't walk away. Stay silent and don't consent</li>
            </ul>
          </div>
        </div>
      </Accordion>
    </div>
  );

  // --- Home Section ---
  const renderHomeInitial = () => (
    <div className="space-y-6">
      <div className="bg-yellow-900/20 light:bg-yellow-50 rounded-xl p-6">
        <SectionHeader>
          <h2 className="text-2xl font-bold mb-4 text-text-primary">Police at Your Home</h2>
        </SectionHeader>
        <div className="bg-surface rounded-lg p-4 border-l-4 border-yellow-400">
          <h3 className="font-bold text-yellow-300 light:text-yellow-800 mb-2">🏠 Your Home's 4th Amendment Protection</h3>
          <p className="text-sm mb-4 text-text-muted">Your home has the strongest Fourth Amendment protections against unreasonable searches.</p>
          <div className="space-y-2 text-text-secondary">
            <div>✓ You don't have to open the door</div>
            <div>✓ You can speak through the closed door</div>
            <div>✓ Demand to see a warrant signed by a judge</div>
            <div>✓ Record through doorbell camera or window</div>
            <div>✓ You can remain completely silent</div>
          </div>
        </div>
      </div>

      <Accordion title="⚖️ Constitutional Protections at Home" isImportant={true}>
        <div className="bg-indigo-900/20 light:bg-indigo-50 p-4 rounded-lg">
          <h4 className="font-bold text-indigo-300 light:text-indigo-800 mb-2">What to Say Through the Door</h4>
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
        <div className="bg-red-900/20 light:bg-red-50 p-4 rounded-lg">
          <h4 className="font-bold text-red-300 light:text-red-800 mb-2">Limited Exceptions (Very Narrow):</h4>
          <ul className="space-y-2 text-sm">
            <li>• <strong>Valid Search Warrant:</strong> Must be signed by a judge, not just police</li>
            <li>• <strong>Arrest Warrant:</strong> Only for the named person's own home, and only if police reasonably believe they're inside</li>
            <li>• <strong>Hot Pursuit:</strong> Chasing someone who just committed a crime</li>
            <li>• <strong>Immediate Danger:</strong> Someone inside is in immediate peril</li>
            <li>• <strong>Destruction of Evidence:</strong> Very limited and specific circumstances</li>
          </ul>
          <p className="text-xs mt-3 font-semibold">Note: "We just want to talk" or "We're investigating" are NOT valid reasons for entry</p>
          <p className="text-xs mt-2">If they come in anyway, don't physically resist. Say "I do not consent," stay silent, and record. A court can throw out what they find.</p>
        </div>
      </Accordion>

      <Accordion title="📋 Warrant Requirements">
        <div className="bg-blue-900/20 light:bg-blue-50 p-4 rounded-lg">
          <h4 className="font-bold text-blue-300 light:text-blue-800 mb-2">Valid Warrant Must Have:</h4>
          <ul className="space-y-1 text-sm">
            <li>• Judge's signature (not just police)</li>
            <li>• Correct address</li>
            <li>• Specific items or persons being sought</li>
            <li>• Recent date (not expired)</li>
            <li>• Ask them to slip it under the door or show through window</li>
          </ul>
          <div className="bg-red-900/20 light:bg-red-50 p-3 rounded mt-3">
            <p className="text-xs font-semibold text-red-300 light:text-red-800">⚠️ IMPORTANT: An arrest warrant for a person does NOT grant entry to a home unless they have reasonable belief the person is inside AND it's that person's residence</p>
          </div>
        </div>
      </Accordion>

      <Accordion title="⚠️ NEVER Open Your Door" isImportant={true}>
        <div className="bg-red-900/20 light:bg-red-50 p-4 rounded-lg">
          <h4 className="font-bold text-red-300 light:text-red-800 mb-2">Why Opening the Door is Dangerous:</h4>
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
  );

  // --- ICE Section ---
  const renderIceInitial = () => (
    <div className="space-y-6">
      <div className="bg-purple-900/20 light:bg-purple-50 rounded-xl p-6">
        <SectionHeader>
          <h2 className="text-2xl font-bold mb-4 text-text-primary">ICE Encounters</h2>
        </SectionHeader>
        <div className="bg-surface rounded-lg p-4 border-l-4 border-purple-400">
          <h3 className="font-bold text-purple-300 light:text-purple-800 mb-2">⚖️ Constitutional Rights Apply to Everyone</h3>
          <p className="text-sm mb-4 text-text-muted">Regardless of immigration status, the Constitution protects you.</p>
          <div className="space-y-2 text-text-secondary">
            <div>✓ 5th Amendment right to remain silent</div>
            <div>✓ 4th Amendment right against unreasonable searches</div>
            <div>✓ Right to a lawyer in immigration court, but not a free one (it's civil, not criminal). Ask for legal aid</div>
            <div>✓ Do not sign anything without an attorney</div>
            <div>✓ Right to refuse entry without judicial warrant</div>
          </div>
        </div>
      </div>

      <Accordion title="📋 If ICE Comes to Your Home" isImportant={true}>
        <div className="bg-blue-900/20 light:bg-blue-50 p-4 rounded-lg">
          <h4 className="font-bold text-blue-300 light:text-blue-800 mb-2">Critical Steps:</h4>
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
        <div className="bg-purple-900/20 light:bg-purple-50 p-4 rounded-lg">
          <h4 className="font-bold text-purple-300 light:text-purple-800 mb-2">What to Say:</h4>
          <ul className="space-y-1 text-sm italic">
            <li>"I invoke my 5th Amendment right to remain silent"</li>
            <li>"I do not consent to any entry or searches"</li>
            <li>"I will not sign anything without an attorney"</li>
            <li>"I want to speak with a lawyer"</li>
            <li>"Show me a warrant signed by a judge"</li>
          </ul>
        </div>
      </Accordion>

      <Accordion title="🚶 If ICE Stops You in Public" isImportant={true}>
        <div className="bg-amber-900/20 light:bg-amber-50 p-4 rounded-lg">
          <ul className="space-y-2 text-sm">
            <li>• Ask: "Am I free to go?" If yes, walk away calmly. Don't run</li>
            <li>• You can stay silent about where you were born, your status, and how you entered the U.S.</li>
            <li className="font-semibold">• Never lie and never show false documents. Both can be crimes and can destroy future immigration options</li>
            <li>• <strong>If you have valid papers</strong> (green card, visa) and are 18 or older, federal law requires you to carry them</li>
            <li>• Don't consent to a search of you or your bag</li>
            <li>• Don't physically resist, even if you think the stop is unlawful</li>
          </ul>
        </div>
      </Accordion>
    </div>
  );

  // --- Arrest Section ---
  const renderArrestInitial = () => (
    <div className="space-y-6">
      <div className="bg-red-900/20 light:bg-red-50 rounded-xl p-6">
        <SectionHeader>
          <h2 className="text-2xl font-bold mb-4 text-text-primary">If You're Arrested</h2>
        </SectionHeader>
        <div className="bg-surface rounded-lg p-4 border-l-4 border-red-400">
          <h3 className="font-bold text-red-300 light:text-red-800 mb-2">✋ Stay Calm, Stay Silent, Ask for a Lawyer</h3>
          <p className="text-sm mb-4 text-text-muted">An arrest is not a conviction. What you do in the next few hours can protect your case.</p>
          <div className="space-y-2 text-text-secondary">
            <div>✓ Don't resist or run, even if you think the arrest is unfair</div>
            <div>✓ Say: "I am going to remain silent. I want a lawyer."</div>
            <div>✓ Then stop talking. Don't explain and don't chat</div>
            <div>✓ Give your name and address. Nothing more</div>
            <div>✓ Don't sign or agree to anything without a lawyer</div>
          </div>
        </div>
      </div>

      <Accordion title="📞 At the Precinct" isImportant={true}>
        <div className="bg-blue-900/20 light:bg-blue-50 p-4 rounded-lg">
          <h4 className="font-bold text-blue-300 light:text-blue-800 mb-2">Phone Calls and Property</h4>
          <ul className="space-y-2 text-sm">
            <li>• Ask to make a phone call. NY law lets you call from the station when you ask, with narrow exceptions <span className="text-xs">(CPL §140.20(7))</span></li>
            <li>• Call a family member, a friend or a lawyer. Tell them where you are being held</li>
            <li className="font-semibold">• Never talk about your case on the phone. Calls can be recorded or listened to</li>
            <li>• Don't talk about your case with officers, people in the cell, or anyone but your lawyer</li>
            <li>• Police will search you and hold your property. Don't unlock your phone or give your passcode</li>
            <li>• If you need medicine or medical care, say so clearly and keep asking</li>
            <li>• Memorize one or two phone numbers now. You won't have your phone</li>
          </ul>
        </div>
      </Accordion>

      <Accordion title="⚖️ Seeing a Judge" isImportant={true}>
        <div className="bg-purple-900/20 light:bg-purple-50 p-4 rounded-lg">
          <h4 className="font-bold text-purple-300 light:text-purple-800 mb-2">Your First Court Appearance</h4>
          <ul className="space-y-2 text-sm">
            <li>• In New York you should generally be brought before a judge within 24 hours. This first hearing is called the arraignment</li>
            <li>• If you can't afford a lawyer, the court will give you a free one at the arraignment. Talk about what happened only with them</li>
            <li>• Don't plead guilty or accept a deal before you talk it through with your lawyer</li>
            <li>• Police may release you with a Desk Appearance Ticket instead. Go to court on the date written on it. If you miss it, a judge can issue a warrant for your arrest</li>
          </ul>
        </div>
      </Accordion>

      <Accordion title="🌎 If You're Not a U.S. Citizen">
        <div className="bg-amber-900/20 light:bg-amber-50 p-4 rounded-lg">
          <ul className="space-y-2 text-sm">
            <li>• Tell your defense lawyer your immigration status. Even a minor guilty plea can affect it</li>
            <li>• Don't discuss your status with police or anyone else</li>
            <li>• Don't sign anything about your immigration status without legal advice</li>
            <li>• You can ask police to notify your country's consulate</li>
          </ul>
        </div>
      </Accordion>

      <Accordion title="👪 If Someone You Know Is Arrested">
        <div className="bg-green-900/20 light:bg-green-50 p-4 rounded-lg">
          <ul className="space-y-2 text-sm">
            <li>• Write down where and when it happened, and the officers' names and badge numbers if you can</li>
            <li>• In NYC, call the precinct or 311 to find where they are being held</li>
            <li>• Call a lawyer. In NYC you can call the Legal Aid Society: <a className="underline font-semibold whitespace-nowrap" href="tel:+12125773300">212-577-3300</a></li>
            <li>• Don't discuss what happened with them over a jail phone</li>
            <li>• Go to the arraignment if you can. It shows the judge they have support</li>
          </ul>
        </div>
      </Accordion>
    </div>
  );

  // --- Rights Section ---
  const renderRightsInitial = () => (
    <div className="space-y-6">
      <div className="bg-indigo-900/20 light:bg-indigo-50 rounded-xl p-6">
        <SectionHeader>
          <h2 className="text-2xl font-bold mb-4 text-text-primary">Constitutional Rights During Law Enforcement Interactions</h2>
        </SectionHeader>
        <div className="bg-surface rounded-lg p-4 border-l-4 border-indigo-400">
          <h3 className="font-bold text-indigo-300 light:text-indigo-800 mb-2">📜 Key Amendments in Police Encounters</h3>
          <div className="space-y-3 text-sm text-text-secondary">
            <div>
              <strong>1st Amendment:</strong> Right to record police, freedom of speech, assembly
              <p className="text-xs mt-1 text-text-muted">• You can record police in public spaces without interfering</p>
              <p className="text-xs text-text-muted">• In NY, state law (Civil Rights Law §79-p) also protects this right</p>
            </div>
            <div>
              <strong>4th Amendment:</strong> Protection from unreasonable searches and seizures
              <p className="text-xs mt-1 text-text-muted">• Requires warrant or probable cause for searches</p>
              <p className="text-xs text-text-muted">• Protects against unlawful detention</p>
            </div>
            <div>
              <strong>5th Amendment:</strong> Right to remain silent, protection against self-incrimination
              <p className="text-xs mt-1 text-text-muted">• You cannot be forced to answer questions</p>
              <p className="text-xs text-text-muted">• Must be clearly invoked out loud. Just staying quiet isn't enough</p>
              <p className="text-xs text-text-muted">• Also gives you the right to a lawyer during custodial questioning (Miranda). Say "I want a lawyer" clearly</p>
            </div>
            <div>
              <strong>6th Amendment:</strong> Right to an attorney once you're formally charged
              <p className="text-xs mt-1 text-text-muted">• If you can't afford one, the court must appoint one for charges that can lead to jail</p>
            </div>
          </div>
        </div>
      </div>

      <Accordion title="⚡ Critical Phrases for Any Police Encounter" isImportant={true}>
        <div className="bg-purple-900/20 light:bg-purple-50 p-4 rounded-lg">
          <h4 className="font-bold text-purple-300 light:text-purple-800 mb-2">Say These Clearly and Calmly:</h4>
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

      <Accordion title="⚠️ Why You Shouldn't Explain Yourself" isImportant={true}>
        <div className="bg-red-900/20 light:bg-red-50 p-4 rounded-lg">
          <h4 className="font-bold text-red-300 light:text-red-800 mb-2">The Legal Asymmetry - Statements Usually Only Hurt You:</h4>
          <ul className="space-y-2 text-sm">
            <li className="font-semibold">• Your statements CAN be used AGAINST you in court</li>
            <li className="font-semibold">• You generally CAN'T use your own out-of-court explanation to HELP you (hearsay rules)</li>
            <li>• Even truthful explanations can be twisted or misremembered</li>
            <li>• "Clearing things up" with police rarely helps</li>
            <li>• Innocent explanations can accidentally provide probable cause</li>
            <li>• Your defense belongs in court with your attorney, not on the street</li>
          </ul>
          <p className="text-xs mt-3 font-semibold bg-red-900/30 light:bg-red-100 p-2 rounded">
            REMEMBER: Give your name and documents when the law requires them. Beyond that, say nothing. Never lie: lying to police can be a separate crime, while silence never is.
          </p>
        </div>
      </Accordion>

      <Accordion title="🚫 What NOT to Do (Protecting Your Rights)">
        <div className="bg-red-900/20 light:bg-red-50 p-4 rounded-lg">
          <h4 className="font-bold text-red-300 light:text-red-800 mb-2">Never Recommended:</h4>
          <ul className="space-y-1 text-sm">
            <li>✗ Answering questions during an investigation</li>
            <li>✗ Trying to "explain your side" (it generally can't help you in court)</li>
            <li>✗ Lying or giving a false name (that can be its own crime)</li>
            <li>✗ Running away</li>
            <li>✗ Consenting to any searches</li>
            <li>✗ Providing information beyond ID when required</li>
            <li>✗ Making statements about where you've been or are going</li>
            <li>✗ Trying to talk your way out of a situation</li>
            <li>✗ Physically resisting (even unlawful arrests)</li>
            <li>✗ Arguing law with officers on scene</li>
            <li>✗ Signing anything without reading and understanding</li>
          </ul>
          <p className="text-xs mt-3 font-semibold">Remember: Anything you say can and will be used against you, but generally can't be used to help you</p>
        </div>
      </Accordion>

      <Accordion title="📱 Always Document Everything">
        <div className="bg-green-900/20 light:bg-green-50 p-4 rounded-lg">
          <h4 className="font-bold text-green-300 light:text-green-800 mb-2">Recording and Documentation Rights:</h4>
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
        <div className="bg-yellow-900/20 light:bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-bold text-yellow-300 light:text-yellow-800 mb-2">Protecting Your Rights After:</h4>
          <ul className="space-y-1 text-sm">
            <li>• File complaints for rights violations. For NYPD, contact the Civilian Complaint Review Board (CCRB) or call 311</li>
            <li>• Contact civil rights attorneys</li>
            <li>• Preserve all evidence and recordings</li>
            <li>• Get medical attention if needed (document injuries)</li>
            <li>• Don't post on social media until consulting attorney</li>
            <li>• Request body cam footage (time limits apply)</li>
          </ul>
        </div>
      </Accordion>

      <Accordion title="📞 Help and Hotlines (New York)">
        <div className="bg-blue-900/20 light:bg-blue-50 p-4 rounded-lg">
          <ul className="space-y-2 text-sm">
            <li>• Legal Aid Society (NYC criminal defense and other legal help): <a className="underline font-semibold whitespace-nowrap" href="tel:+12125773300">212-577-3300</a></li>
            <li>• NY State New Americans Hotline (free immigration help in 200+ languages): <a className="underline font-semibold whitespace-nowrap" href="tel:+18005667636">1-800-566-7636</a></li>
            <li>• Complaints about NYPD officers (Civilian Complaint Review Board): <a className="underline font-semibold whitespace-nowrap" href="tel:+18003412272">1-800-341-2272</a></li>
          </ul>
          <p className="text-xs mt-3">Phone numbers and hours can change. Check them before you need them.</p>
        </div>
      </Accordion>

      <Accordion title="📚 Sources">
        <div className="bg-indigo-900/20 light:bg-indigo-50 p-4 rounded-lg">
          <p className="text-sm mb-3">This guide summarizes the sources below. Laws change, and courts keep interpreting them.</p>
          <ul className="space-y-2 text-sm">
            <li>• <a className="underline" href="https://www.nyclu.org/resources/know-your-rights" target="_blank" rel="noopener noreferrer">NYCLU: Know Your Rights</a></li>
            <li>• <a className="underline" href="https://www.aclu.org/know-your-rights/stopped-by-police" target="_blank" rel="noopener noreferrer">ACLU: Stopped by Police</a></li>
            <li>• <a className="underline" href="https://www.aclu.org/know-your-rights/immigrants-rights" target="_blank" rel="noopener noreferrer">ACLU: Immigrants' Rights</a></li>
            <li>• <a className="underline" href="https://www.nysenate.gov/legislation/laws/CVR/79-P" target="_blank" rel="noopener noreferrer">NY Civil Rights Law §79-p (right to record)</a></li>
            <li>• <a className="underline" href="https://www.nysenate.gov/legislation/laws/CPL/140.50" target="_blank" rel="noopener noreferrer">NY Criminal Procedure Law §140.50 (street stops)</a></li>
            <li>• <a className="underline" href="https://www.nysenate.gov/legislation/laws/CPL/140.20" target="_blank" rel="noopener noreferrer">NY Criminal Procedure Law §140.20 (after an arrest)</a></li>
            <li>• <a className="underline" href="https://www.nysenate.gov/legislation/laws/VAT/1194" target="_blank" rel="noopener noreferrer">NY Vehicle and Traffic Law §1194 (breath and chemical tests)</a></li>
            <li>• <a className="underline" href="https://www.nyc.gov/site/ccrb/complaints/file-a-complaint/right-to-know-act.page" target="_blank" rel="noopener noreferrer">NYC Right to Know Act (CCRB)</a></li>
            <li>• <a className="underline" href="https://law.justia.com/cases/new-york/court-of-appeals/2026/no-59.html" target="_blank" rel="noopener noreferrer">Reyes v. City of New York (NY Court of Appeals, 2026)</a></li>
            <li>• <a className="underline" href="https://www.law.cornell.edu/uscode/text/8/1304" target="_blank" rel="noopener noreferrer">8 U.S.C. §1304(e) (carrying immigration papers)</a></li>
          </ul>
        </div>
      </Accordion>

      <div className="mt-6 p-4 bg-surface rounded-xl border border-border-subtle">
        <h4 className="font-bold text-text-secondary mb-2 flex items-center gap-2">
          <Scale className="h-5 w-5" />
          Important Legal Notice
        </h4>
        <p className="text-xs text-text-muted">
          This app provides general information about legal rights in the United States. It is not legal advice,
          and no attorney-client relationship is created. Laws may vary by state and jurisdiction. Rights described here
          are based on federal and New York law; other states' laws may provide different protections or requirements. For legal advice specific to your situation, consult a licensed attorney in your jurisdiction.
          If you are arrested or charged with a crime, seek legal counsel immediately.
        </p>
      </div>
    </div>
  );

  if (section === 'vehicle') {
    if (currentStep === 'driver') return renderVehicleDriver();
    if (currentStep === 'passenger') return renderVehiclePassenger();
    return renderVehicleInitial();
  }
  if (section === 'street') return renderStreetInitial();
  if (section === 'home') return renderHomeInitial();
  if (section === 'ice') return renderIceInitial();
  if (section === 'arrest') return renderArrestInitial();
  if (section === 'rights') return renderRightsInitial();
  return null;
}
