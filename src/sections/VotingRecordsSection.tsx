import { SectionCard } from '../components/SectionCard';
import { VoteBadge } from '../components/VoteBadge';
import { cityCouncil } from '../data/officials';
import { ExternalLink } from 'lucide-react';

export function VotingRecordsSection() {
  const somers = cityCouncil.find(c => c.id === 'somers');

  return (
    <div id="voting-records">
      <SectionCard
        title="Voting Records"
        subtitle="How your representatives voted on key legislation"
      >
        {/* Somers recent votes */}
        {somers?.votes && (
          <div className="mb-6">
            <p className="section-label mb-3">Your Councilmember — Scott Somers (District 6)</p>
            <div className="space-y-2 mb-4">
              {somers.votes.map((v, i) => (
                <div key={i} className="flex items-start gap-3 bg-sand-100 rounded-lg p-3 border border-sand-200">
                  <VoteBadge vote={v.vote} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-navy">{v.bill}</p>
                    <p className="text-xs text-navy/50 mt-0.5">{v.date} — {v.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-sand-100 rounded-lg p-3 text-xs text-navy/60 space-y-0.5 mb-4">
              <p><strong>Attendance Rate:</strong> 100% (12/12 meetings)</p>
              <p><strong>Committee Assignments:</strong> Public Safety &amp; Transportation</p>
            </div>
          </div>
        )}

        {/* Alerts section */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm">
          <p className="font-semibold text-amber-800 mb-2">Set Up Legislative Alerts</p>
          <ul className="space-y-1.5 text-amber-700">
            <li>
              <a href="https://www.azleg.gov/RequestListeners.asp" target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1 underline hover:no-underline">
                <ExternalLink size={11} /> AZ Legislature Email Alerts
              </a>
            </li>
            <li>
              <a href="https://public.govdelivery.com/accounts/AZMESA/subscriber/new" target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1 underline hover:no-underline">
                <ExternalLink size={11} /> Mesa City eNotifications
              </a>
            </li>
            <li>
              <a href="https://www.congress.gov/account" target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1 underline hover:no-underline">
                <ExternalLink size={11} /> Congress.gov Account (Federal)
              </a>
            </li>
          </ul>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <a href="https://www.mesaaz.gov/Government/City-Council-Meetings" target="_blank" rel="noreferrer"
            className="contact-btn outline text-xs">Watch Meeting Videos</a>
          <a href="https://www.mesaaz.gov/Government/City-Clerk/Ordinances-Resolutions" target="_blank" rel="noreferrer"
            className="contact-btn outline text-xs">Full Voting Record</a>
        </div>
      </SectionCard>
    </div>
  );
}
