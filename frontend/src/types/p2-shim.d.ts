/**
 * frontend/src/types/p2-shim.d.ts
 * Scoped ambient module declarations for P2 JavaScript/JSX components and data modules.
 */

declare module '*.jsx' {
  const content: any;
  export default content;
  export const TopBar: any;
  export const StepRail: any;
  export const DemoFooter: any;
  export const LandingScreen: any;
  export const CampaignsScreen: any;
  export const BriefStep: any;
  export const MatchesStep: any;
  export const ShortlistStep: any;
  export const SummaryStep: any;
  export const PipelineView: any;
  export const DiscoverScreen: any;
  export const CreatorProfileScreen: any;
  export const ColophonSheet: any;
  export const FitSheet: any;
  export const StudioBot: any;
  export const CropMarks: any;
  export const CreditLine: any;
  export const FitMeter: any;
  export const BrandLogo: any;
  export const RegistrationMark: any;
  export const ColophonLockup: any;
  export const ApprovalStamp: any;
  export const MetricBlock: any;
  export const ProvenanceTag: any;
  export const RangeFitBar: any;
  export const HowWeLabelDataModal: any;
  export const InsufficientData: any;
  export const RoiFormulaPopover: any;
  export const Sparkline: any;
  export const StatusGlyph: any;
  export const ToolMark: any;
  export const WorkflowStrip: any;
  export const CampaignActionBar: any;
  export const CreatorSheet: any;
}

declare module '*/data/briefs' {
  export const INITIAL_CAMPAIGNS: any[];
}

declare module '*/data/creators' {
  export const CREATORS_DATA: any[];
}
