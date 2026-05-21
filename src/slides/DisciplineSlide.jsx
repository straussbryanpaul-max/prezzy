import Card from '../components/Card.jsx';
import Guidance from '../components/Guidance.jsx';
import BrainDump from '../components/BrainDump.jsx';
import ImageUpload from '../components/ImageUpload.jsx';
import { FormGroup, Input, Select, TextArea } from '../components/Field.jsx';
import { MTO_METHODS, PRICING_LEVELS } from '../data/constants.js';

export default function DisciplineSlide({ discipline: d, onRedactChange }) {
  return (
    <>
      <div className="section-divider">
        <h1>{d.name} Estimate Basis</h1>
        <div className="sub">Slide {d.code}</div>
      </div>

      <Card slideId={`disc_${d.id}`} title={`${d.name} — Quantification & MTO Methodology`} num={d.code} onRedactChange={onRedactChange}>
        <Guidance>
          Provide summary basis of: Items, quantity and methodology. Identify whether quantities are engineered, factored or
          allowance based. Reference sources as applicable.
        </Guidance>
        <table className="data-table">
          <thead><tr><th>Commodity</th><th>MTO Methodology</th><th>Method Type</th></tr></thead>
          <tbody>
            <tr>
              <td style={{ fontWeight: 600, color: 'var(--red)' }}>Open Items</td>
              <td><TextArea name={`disc_open_${d.id}`} placeholder="List open items..." /></td>
              <td></td>
            </tr>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                <td><Input name={`disc_comm_${d.id}_${i}`} placeholder="Commodity name" /></td>
                <td><TextArea name={`disc_mto_${d.id}_${i}`} placeholder="Describe MTO basis..." /></td>
                <td><Select name={`disc_method_${d.id}_${i}`} options={MTO_METHODS} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <BrainDump slideId={`disc_quant_${d.id}`} />
      </Card>

      <Card slideId={`disc_nto_${d.id}`} title={`${d.name} — NTO Quantity Table`} num={d.code} onRedactChange={onRedactChange}>
        <Guidance>Non-Material Takeoff methodology. Identify basis for NTO quantities. Pull screenshot from BETK PowerBI Reports – Allowances.</Guidance>
        <ImageUpload name={`disc_nto_img_${d.id}`} />
        <div style={{ marginTop: 16 }}>
          <FormGroup label="NTO Narrative">
            <TextArea name={`disc_nto_narr_${d.id}`} placeholder="Describe NTO methodology..." />
          </FormGroup>
        </div>
      </Card>

      <Card slideId={`disc_pricing_${d.id}`} title={`${d.name} — Pricing Qualifications & Basis`} num={d.code} onRedactChange={onRedactChange}>
        <Guidance>Commodity detail, pricing level, cost ($ value), percent (%) of total value. Include discussion on pricing methodology and sources.</Guidance>
        <FormGroup label="Pricing Narrative">
          <TextArea name={`disc_price_narr_${d.id}`} placeholder="Describe pricing methodology, sources, and qualifications..." rows={6} />
        </FormGroup>
        <BrainDump slideId={`disc_pricing_${d.id}`} />
      </Card>

      <Card slideId={`disc_osm_${d.id}`} title={`${d.name} — OSM v. Stick-Built`} num={d.code} onRedactChange={onRedactChange}>
        <Guidance>Provide discipline specific input on how OSM was approached, and key summary of breakout quantities.</Guidance>
        <ImageUpload name={`disc_osm_img_${d.id}`} />
        <div style={{ marginTop: 16 }}>
          <FormGroup label="OSM Narrative">
            <TextArea name={`disc_osm_narr_${d.id}`} placeholder="Describe OSM approach and breakout..." />
          </FormGroup>
        </div>
      </Card>

      <Card slideId={`disc_plevel_${d.id}`} title={`${d.name} — Pricing Level Summary & Bulk Material Packages`} num={d.code} onRedactChange={onRedactChange}>
        <Guidance>Include pricing level charts identifying bulk material cost by procurement levels (firm, budget, informal, +/-0% etc.)</Guidance>
        <ImageUpload name={`disc_plevel_img_${d.id}`} />
        <table className="data-table" style={{ marginTop: 16 }}>
          <thead><tr><th>Description</th><th>COA</th><th>MR/Vendor</th><th>Pricing Level</th><th>Cost</th><th>Notes</th></tr></thead>
          <tbody>
            {Array.from({ length: 4 }).map((_, i) => (
              <tr key={i}>
                <td><Input name={`disc_bl_desc_${d.id}_${i}`} /></td>
                <td><Input name={`disc_bl_coa_${d.id}_${i}`} /></td>
                <td><Input name={`disc_bl_vendor_${d.id}_${i}`} /></td>
                <td><Select name={`disc_bl_pl_${d.id}_${i}`} options={PRICING_LEVELS} /></td>
                <td><Input name={`disc_bl_cost_${d.id}_${i}`} placeholder="$" /></td>
                <td><Input name={`disc_bl_notes_${d.id}_${i}`} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card slideId={`disc_compare_${d.id}`} title={`${d.name} — Quantity & Historical Comparisons`} num={d.code} onRedactChange={onRedactChange}>
        <Guidance>
          Comparison of quantities relevant to the discipline and comparable projects. Pull from BETK PowerBI Reports. Historical
          comparison slides are REDACTED by default.
        </Guidance>
        <FormGroup label="Quantity Comparison (Green & Yellow Tables)" />
        <ImageUpload name={`disc_qcomp_img_${d.id}`} />
        <div style={{ marginTop: 16 }}>
          <FormGroup label="Discipline Metric Comparison" />
          <ImageUpload name={`disc_metric_img_${d.id}`} />
        </div>
        <div style={{ marginTop: 16, padding: 12, background: '#FEF3C7', borderRadius: 8, fontSize: 12, color: '#92400E' }}>
          ⚠️ Historical comparisons below are typically <strong>REDACTED</strong> for general distribution.
        </div>
        <div style={{ marginTop: 12 }}>
          <FormGroup label="Quantity Historical Comparison" />
          <ImageUpload name={`disc_qhist_img_${d.id}`} />
        </div>
        <div style={{ marginTop: 12 }}>
          <FormGroup label="Hours Historical Comparison" />
          <ImageUpload name={`disc_hhist_img_${d.id}`} />
        </div>
        <div style={{ marginTop: 12 }}>
          <FormGroup label="Cost Historical Comparison" />
          <ImageUpload name={`disc_chist_img_${d.id}`} />
        </div>
      </Card>
    </>
  );
}
