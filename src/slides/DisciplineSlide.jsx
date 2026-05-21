import Card from '../components/Card.jsx';
import Guidance from '../components/Guidance.jsx';
import BrainDump from '../components/BrainDump.jsx';
import ImageUpload from '../components/ImageUpload.jsx';
import EditableChunk from '../components/EditableChunk.jsx';
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
          allowance based.
        </Guidance>
        <EditableChunk id={`disc_${d.id}:mto_table`} label="MTO methodology table">
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
        </EditableChunk>
        <BrainDump slideId={`disc_quant_${d.id}`} />
      </Card>

      <Card slideId={`disc_nto_${d.id}`} title={`${d.name} — NTO Quantity Table`} num={d.code} onRedactChange={onRedactChange}>
        <Guidance>Non-Material Takeoff methodology. Pull screenshot from BETK PowerBI Reports – Allowances.</Guidance>
        <EditableChunk id={`disc_nto_${d.id}:img`} label="NTO screenshot">
          <ImageUpload name={`disc_nto_img_${d.id}`} />
        </EditableChunk>
        <EditableChunk id={`disc_nto_${d.id}:narr`} label="NTO Narrative">
          <div style={{ marginTop: 16 }}>
            <FormGroup label="NTO Narrative">
              <TextArea name={`disc_nto_narr_${d.id}`} placeholder="Describe NTO methodology..." />
            </FormGroup>
          </div>
        </EditableChunk>
      </Card>

      <Card slideId={`disc_pricing_${d.id}`} title={`${d.name} — Pricing Qualifications & Basis`} num={d.code} onRedactChange={onRedactChange}>
        <Guidance>Commodity detail, pricing level, cost ($ value), percent (%) of total value.</Guidance>
        <EditableChunk id={`disc_pricing_${d.id}:narr`} label="Pricing Narrative">
          <FormGroup label="Pricing Narrative">
            <TextArea name={`disc_price_narr_${d.id}`} placeholder="Describe pricing methodology, sources, and qualifications..." rows={6} />
          </FormGroup>
        </EditableChunk>
        <BrainDump slideId={`disc_pricing_${d.id}`} />
      </Card>

      <Card slideId={`disc_osm_${d.id}`} title={`${d.name} — OSM v. Stick-Built`} num={d.code} onRedactChange={onRedactChange}>
        <Guidance>Provide discipline specific input on how OSM was approached, and key summary of breakout quantities.</Guidance>
        <EditableChunk id={`disc_osm_${d.id}:img`} label="OSM image">
          <ImageUpload name={`disc_osm_img_${d.id}`} />
        </EditableChunk>
        <EditableChunk id={`disc_osm_${d.id}:narr`} label="OSM Narrative">
          <div style={{ marginTop: 16 }}>
            <FormGroup label="OSM Narrative">
              <TextArea name={`disc_osm_narr_${d.id}`} placeholder="Describe OSM approach and breakout..." />
            </FormGroup>
          </div>
        </EditableChunk>
      </Card>

      <Card slideId={`disc_plevel_${d.id}`} title={`${d.name} — Pricing Level Summary & Bulk Material Packages`} num={d.code} onRedactChange={onRedactChange}>
        <Guidance>Include pricing level charts identifying bulk material cost by procurement levels.</Guidance>
        <EditableChunk id={`disc_plevel_${d.id}:img`} label="Pricing level chart">
          <ImageUpload name={`disc_plevel_img_${d.id}`} />
        </EditableChunk>
        <EditableChunk id={`disc_plevel_${d.id}:table`} label="Bulk material table">
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
        </EditableChunk>
      </Card>

      <Card slideId={`disc_compare_${d.id}`} title={`${d.name} — Quantity & Historical Comparisons`} num={d.code} onRedactChange={onRedactChange}>
        <Guidance>
          Comparison of quantities relevant to the discipline and comparable projects. Historical comparison slides are
          REDACTED by default.
        </Guidance>
        <EditableChunk id={`disc_compare_${d.id}:qcomp`} label="Quantity comparison image">
          <FormGroup label="Quantity Comparison (Green & Yellow Tables)" />
          <ImageUpload name={`disc_qcomp_img_${d.id}`} />
        </EditableChunk>
        <EditableChunk id={`disc_compare_${d.id}:metric`} label="Metric comparison image">
          <div style={{ marginTop: 16 }}>
            <FormGroup label="Discipline Metric Comparison" />
            <ImageUpload name={`disc_metric_img_${d.id}`} />
          </div>
        </EditableChunk>
        <div style={{ marginTop: 16, padding: 12, background: '#FEF3C7', borderRadius: 8, fontSize: 12, color: '#92400E' }}>
          ⚠️ Historical comparisons below are typically <strong>REDACTED</strong> for general distribution.
        </div>
        <EditableChunk id={`disc_compare_${d.id}:qhist`} label="Quantity historical comparison">
          <div style={{ marginTop: 12 }}>
            <FormGroup label="Quantity Historical Comparison" />
            <ImageUpload name={`disc_qhist_img_${d.id}`} />
          </div>
        </EditableChunk>
        <EditableChunk id={`disc_compare_${d.id}:hhist`} label="Hours historical comparison">
          <div style={{ marginTop: 12 }}>
            <FormGroup label="Hours Historical Comparison" />
            <ImageUpload name={`disc_hhist_img_${d.id}`} />
          </div>
        </EditableChunk>
        <EditableChunk id={`disc_compare_${d.id}:chist`} label="Cost historical comparison">
          <div style={{ marginTop: 12 }}>
            <FormGroup label="Cost Historical Comparison" />
            <ImageUpload name={`disc_chist_img_${d.id}`} />
          </div>
        </EditableChunk>
      </Card>
    </>
  );
}
