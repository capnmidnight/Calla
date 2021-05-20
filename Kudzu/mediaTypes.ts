import { arraySortByKey, arraySortedInsert } from "./arrays/arraySortedInsert";
import { isArray, isDefined, isNullOrUndefined, isNumber, isString } from "./typeChecks";

const byValue = new Map<string, MediaType>();
const byExtension = new Map<string, MediaType[]>();
const typePattern = /(\*|\w+)\/(\*|(-|\w)+)(?:;q=(1|0?\.\d+))?/;

export class MediaType {
    private readonly weightedValue: string;

    readonly value: string;
    readonly weight: number;
    readonly extensions: ReadonlyArray<string>;
    readonly primaryExtension: string = null;


    constructor(typeName: string, subTypeName: string);
    constructor(typeName: string, subTypeName: string, extensions: ReadonlyArray<string>);
    constructor(typeName: string, subTypeName: string, weight: number);
    constructor(typeName: string, subTypeName: string, extensions: ReadonlyArray<string>, weight: number);
    constructor(public readonly typeName: string, public readonly subTypeName: string, extensions?: number | ReadonlyArray<string>, weight?: number) {
        this.value = this.typeName + "/" + this.subTypeName;
        this.weightedValue = `"${this.value};q=${this.weight}`;

        if (isArray(extensions)) {
            this.extensions = extensions;
        }
        else {
            this.extensions = [];
        }

        if (isNumber(weight)) {
            this.weight = weight;
        }
        else {
            this.weight = 1;
        }

        if (this.extensions.length > 0) {
            this.primaryExtension = this.extensions[0];
        }

        registerMediaType(this);
    }

    toString() {
        if (this.weight === 1) {
            return this.value;
        }
        else {
            return this.weightedValue;
        }
    }

    addExtension(fileName: string): string {
        if (isNullOrUndefined(fileName)) {
            throw new Error("File name is not defined");
        }

        if (isDefined(this.primaryExtension)) {
            const idx = fileName.lastIndexOf(".");
            if (idx > -1) {
                const currentExtension = fileName.substring(idx + 1);;
                if (this.extensions.indexOf(currentExtension) > -1) {
                    fileName = fileName.substring(0, idx);
                }

                fileName = fileName + "." + this.primaryExtension;
            }
        }

        return fileName;
    }
}

export class Application extends MediaType {
    constructor(value: string, ...extensions: string[]) {
        super("application", value, extensions);
    }
}

export class Audio extends MediaType {
    constructor(value: string, ...extensions: string[]) {
        super("audio", value, extensions);
    }
}

export class Chemical extends MediaType {
    constructor(value: string, ...extensions: string[]) {
        super("chemical", value, extensions);
    }
}

export class Font extends MediaType {
    constructor(value: string, ...extensions: string[]) {
        super("font", value, extensions);
    }
}

export class Image extends MediaType {
    constructor(value: string, ...extensions: string[]) {
        super("image", value, extensions);
    }
}

export class Message extends MediaType {
    constructor(value: string, ...extensions: string[]) {
        super("message", value, extensions);
    }
}

export class Model extends MediaType {
    constructor(value: string, ...extensions: string[]) {
        super("model", value, extensions);
    }
}

export class Multipart extends MediaType {
    constructor(value: string, ...extensions: string[]) {
        super("multipart", value, extensions);
    }
}

export class Text extends MediaType {
    constructor(value: string, ...extensions: string[]) {
        super("text", value, extensions);
    }
}

export class Video extends MediaType {
    constructor(value: string, ...extensions: string[]) {
        super("video", value, extensions);
    }
}

export class XConference extends MediaType {
    constructor(value: string, ...extensions: string[]) {
        super("xconference", value, extensions);
    }
}

export class XShader extends MediaType {
    constructor(value: string, ...extensions: string[]) {
        super("x-shader", value, extensions);
    }
}

function registerMediaType<T extends MediaType>(type: T): T {
    byValue.set(type.value, type);

    for (const ext of type.extensions) {
        if (!byExtension.has(ext)) {
            byExtension.set(ext, new Array<MediaType>());
        }

        byExtension.get(ext).push(type);
    }

    return type;
}

export function parseMediaType(value: string): MediaType {
    if (isNullOrUndefined(value)) {
        return null;
    }

    const match = value.match(typePattern);
    if (isNullOrUndefined(match)) {
        return null;
    }

    const typeName = match[1];
    const subTypeName = match[2];
    const rawValue = typeName + "/" + subTypeName;

    if (match.length === 4) {
        const weight = parseFloat(match[3]);
        if (Number.isNaN(weight)
            || !Number.isFinite(weight)) {
            return null;
        }

        return new MediaType(typeName, subTypeName, weight);
    }
    else if (byValue.has(rawValue)) {
        return byValue.get(rawValue);
    }
    else {
        return new MediaType(typeName, subTypeName);
    }
}

export function mediaTypesMatch(value: string, pattern: string): boolean;
export function mediaTypesMatch(value: string, pattern: MediaType): boolean;
export function mediaTypesMatch(value: MediaType, pattern: string): boolean;
export function mediaTypesMatch(value: MediaType, pattern: MediaType): boolean;
export function mediaTypesMatch(value: string | MediaType, pattern: string | MediaType): boolean {
    if (isString(value)) {
        value = parseMediaType(value);
    }

    if (isString(pattern)) {
        pattern = parseMediaType(pattern);
    }

    return (pattern.typeName === "*" && pattern.subTypeName === "*")
        || (pattern.typeName === value.typeName
            && (pattern.subTypeName === "*"
                || pattern.subTypeName === value.subTypeName));
}

export function guessMediaTypeByFileName(fileName: string): MediaType[] {
    if (isNullOrUndefined(fileName)
        || fileName.length === 0) {
        throw new Error("Must provide a valid fileName");
    }

    const leftIdx = fileName.indexOf(".");
    const rightIdx = fileName.lastIndexOf(".");
    if (leftIdx === rightIdx) {
        const ext = fileName.substring(leftIdx);
        return guessMediaTypeByExtension(ext);
    }
    else {
        const leftExt = fileName.substring(leftIdx);
        const rightExt = fileName.substring(rightIdx);
        const left = guessMediaTypeByExtension(leftExt);
        arraySortByKey(left, ext => ext.toString());
        const right = guessMediaTypeByExtension(rightExt);
        for (const ext of right) {
            arraySortedInsert(left, ext, ext => ext.toString());
        }
        return left;
    }
}

export function fileNameMatchesMediaType(fileName: string, pattern: string): boolean;
export function fileNameMatchesMediaType(fileName: string, pattern: MediaType): boolean;
export function fileNameMatchesMediaType(fileName: string, pattern: string|MediaType): boolean {
    if (isNullOrUndefined(fileName)
        || fileName.length === 0) {
        return false;
    }

    if (isString(pattern)) {
        pattern = parseMediaType(pattern);
    }

    const types = guessMediaTypeByFileName(fileName);
    for (const type of types) {
        if (mediaTypesMatch(type, pattern)) {
            return true;
        }
    }

    return false;
}

export function guessMediaTypeByExtension(ext: string): MediaType[] {
    if (isNullOrUndefined(ext)
        || ext.length === 0) {
        ext = "unknown";
    }
    else if (ext[0] == '.') {
        ext = ext.substring(1);
    }

    if (byExtension.has(ext)) {
        return byExtension.get(ext);
    }
    else {
        return [new MediaType("unknown", ext, [ext])];
    }
}

export function extensionMatchesMediaType(ext: string, pattern: string): boolean;
export function extensionMatchesMediaType(ext: string, pattern: MediaType): boolean;
export function extensionMatchesMediaType(ext: string, pattern: string | MediaType): boolean {
    if (isNullOrUndefined(ext)
        || ext.length === 0) {
        return false;
    }

    if (isString(pattern)) {
        pattern = parseMediaType(pattern);
    }

    const types = guessMediaTypeByExtension(ext);
    for (const type of types) {
        if (mediaTypesMatch(type, pattern)) {
            return true;
        }
    }

    return false;
}

export const anyMediaType = new MediaType("*", "*");
export const unknownMediaType = new MediaType("unknown", "unknown");

export const anyApplication = new Application("*");
export const Application_A2L = new Application("a2l");
export const Application_Activemessage = new Application("activemessage");
export const Application_ActivityJson = new Application("activity+json", "json");
export const Application_Alto_CostmapfilterJson = new Application("alto-costmapfilter+json", "json");
export const Application_Alto_CostmapJson = new Application("alto-costmap+json", "json");
export const Application_Alto_DirectoryJson = new Application("alto-directory+json", "json");
export const Application_Alto_EndpointcostJson = new Application("alto-endpointcost+json", "json");
export const Application_Alto_EndpointcostparamsJson = new Application("alto-endpointcostparams+json", "json");
export const Application_Alto_EndpointpropJson = new Application("alto-endpointprop+json", "json");
export const Application_Alto_EndpointpropparamsJson = new Application("alto-endpointpropparams+json", "json");
export const Application_Alto_ErrorJson = new Application("alto-error+json", "json");
export const Application_Alto_NetworkmapfilterJson = new Application("alto-networkmapfilter+json", "json");
export const Application_Alto_NetworkmapJson = new Application("alto-networkmap+json", "json");
export const Application_AML = new Application("aml");
export const Application_Andrew_Inset = new Application("andrew-inset", "ez");
export const Application_Applefile = new Application("applefile");
export const Application_Applixware = new Application("applixware", "aw");
export const Application_ATF = new Application("atf");
export const Application_ATFX = new Application("atfx");
export const Application_AtomcatXml = new Application("atomcat+xml", "atomcat");
export const Application_AtomdeletedXml = new Application("atomdeleted+xml", "xml");
export const Application_Atomicmail = new Application("atomicmail");
export const Application_AtomsvcXml = new Application("atomsvc+xml", "atomsvc");
export const Application_AtomXml = new Application("atom+xml", "atom");
export const Application_Atsc_DwdXml = new Application("atsc-dwd+xml", "xml");
export const Application_Atsc_HeldXml = new Application("atsc-held+xml", "xml");
export const Application_Atsc_RdtJson = new Application("atsc-rdt+json", "json");
export const Application_Atsc_RsatXml = new Application("atsc-rsat+xml", "xml");
export const Application_ATXML = new Application("atxml");
export const Application_Auth_PolicyXml = new Application("auth-policy+xml", "xml");
export const Application_Bacnet_XddZip = new Application("bacnet-xdd+zip", "zip");
export const Application_Batch_SMTP = new Application("batch-smtp");
export const Application_BeepXml = new Application("beep+xml", "xml");
export const Application_CalendarJson = new Application("calendar+json", "json");
export const Application_CalendarXml = new Application("calendar+xml", "xml");
export const Application_Call_Completion = new Application("call-completion");
export const Application_CALS_1840 = new Application("cals-1840");
export const Application_Cbor = new Application("cbor");
export const Application_Cbor_Seq = new Application("cbor-seq");
export const Application_Cccex = new Application("cccex");
export const Application_CcmpXml = new Application("ccmp+xml", "xml");
export const Application_CcxmlXml = new Application("ccxml+xml", "ccxml");
export const Application_CDFXXML = new Application("cdfx+xml", "xml");
export const Application_Cdmi_Capability = new Application("cdmi-capability", "cdmia");
export const Application_Cdmi_Container = new Application("cdmi-container", "cdmic");
export const Application_Cdmi_Domain = new Application("cdmi-domain", "cdmid");
export const Application_Cdmi_Object = new Application("cdmi-object", "cdmio");
export const Application_Cdmi_Queue = new Application("cdmi-queue", "cdmiq");
export const Application_Cdni = new Application("cdni");
export const Application_CEA = new Application("cea");
export const Application_Cea_2018Xml = new Application("cea-2018+xml", "xml");
export const Application_CellmlXml = new Application("cellml+xml", "xml");
export const Application_Cfw = new Application("cfw");
export const Application_Clue_infoXml = new Application("clue_info+xml", "xml");
export const Application_ClueXml = new Application("clue+xml", "xml");
export const Application_Cms = new Application("cms");
export const Application_CnrpXml = new Application("cnrp+xml", "xml");
export const Application_Coap_GroupJson = new Application("coap-group+json", "json");
export const Application_Coap_Payload = new Application("coap-payload");
export const Application_Commonground = new Application("commonground");
export const Application_Conference_InfoXml = new Application("conference-info+xml", "xml");
export const Application_Cose = new Application("cose");
export const Application_Cose_Key = new Application("cose-key");
export const Application_Cose_Key_Set = new Application("cose-key-set");
export const Application_CplXml = new Application("cpl+xml", "xml");
export const Application_Csrattrs = new Application("csrattrs");
export const Application_CSTAdataXml = new Application("cstadata+xml", "xml");
export const Application_CstaXml = new Application("csta+xml", "xml");
export const Application_CsvmJson = new Application("csvm+json", "json");
export const Application_Cu_Seeme = new Application("cu-seeme", "cu");
export const Application_Cwt = new Application("cwt");
export const Application_Cybercash = new Application("cybercash");
export const Application_Dashdelta = new Application("dashdelta");
export const Application_DashXml = new Application("dash+xml", "xml");
export const Application_DavmountXml = new Application("davmount+xml", "davmount");
export const Application_Dca_Rft = new Application("dca-rft");
export const Application_DCD = new Application("dcd");
export const Application_Dec_Dx = new Application("dec-dx");
export const Application_Dialog_InfoXml = new Application("dialog-info+xml", "xml");
export const Application_Dicom = new Application("dicom");
export const Application_DicomJson = new Application("dicom+json", "json");
export const Application_DicomXml = new Application("dicom+xml", "xml");
export const Application_DII = new Application("dii");
export const Application_DIT = new Application("dit");
export const Application_Dns = new Application("dns");
export const Application_Dns_Message = new Application("dns-message");
export const Application_DnsJson = new Application("dns+json", "json");
export const Application_DocbookXml = new Application("docbook+xml", "dbk");
export const Application_DotsCbor = new Application("dots+cbor", "cbor");
export const Application_DskppXml = new Application("dskpp+xml", "xml");
export const Application_DsscDer = new Application("dssc+der", "dssc");
export const Application_DsscXml = new Application("dssc+xml", "xdssc");
export const Application_Dvcs = new Application("dvcs");
export const Application_Ecmascript = new Application("ecmascript", "ecma");
export const Application_EDI_Consent = new Application("edi-consent");
export const Application_EDI_X12 = new Application("edi-x12");
export const Application_EDIFACT = new Application("edifact");
export const Application_Efi = new Application("efi");
export const Application_EmergencyCallDataCommentXml = new Application("emergencycalldata.comment+xml", "xml");
export const Application_EmergencyCallDataControlXml = new Application("emergencycalldata.control+xml", "xml");
export const Application_EmergencyCallDataDeviceInfoXml = new Application("emergencycalldata.deviceinfo+xml", "xml");
export const Application_EmergencyCallDataECallMSD = new Application("emergencycalldata.ecall.msd");
export const Application_EmergencyCallDataProviderInfoXml = new Application("emergencycalldata.providerinfo+xml", "xml");
export const Application_EmergencyCallDataServiceInfoXml = new Application("emergencycalldata.serviceinfo+xml", "xml");
export const Application_EmergencyCallDataSubscriberInfoXml = new Application("emergencycalldata.subscriberinfo+xml", "xml");
export const Application_EmergencyCallDataVEDSXml = new Application("emergencycalldata.veds+xml", "xml");
export const Application_EmmaXml = new Application("emma+xml", "emma");
export const Application_EmotionmlXml = new Application("emotionml+xml", "xml");
export const Application_Encaprtp = new Application("encaprtp");
export const Application_EppXml = new Application("epp+xml", "xml");
export const Application_EpubZip = new Application("epub+zip", "epub");
export const Application_Eshop = new Application("eshop");
export const Application_Example = new Application("example");
export const Application_Exi = new Application("exi", "exi");
export const Application_Expect_Ct_ReportJson = new Application("expect-ct-report+json", "json");
export const Application_Fastinfoset = new Application("fastinfoset");
export const Application_Fastsoap = new Application("fastsoap");
export const Application_FdtXml = new Application("fdt+xml", "xml");
export const Application_FhirJson = new Application("fhir+json", "json");
export const Application_FhirXml = new Application("fhir+xml", "xml");
export const Application_Fits = new Application("fits");
export const Application_Flexfec = new Application("flexfec");

//[System.Obsolete("DEPRECATED in favor of font/sfnt")];
export const Application_Font_Sfnt = new Application("font-sfnt");

export const Application_Font_Tdpfr = new Application("font-tdpfr", "pfr");

//[System.Obsolete("DEPRECATED in favor of font/woff")];
export const Application_Font_Woff = new Application("font-woff");

export const Application_Framework_AttributesXml = new Application("framework-attributes+xml", "xml");
export const Application_GeoJson = new Application("geo+json", "json");
export const Application_GeoJson_Seq = new Application("geo+json-seq", "json-seq");
export const Application_GeopackageSqlite3 = new Application("geopackage+sqlite3", "sqlite3");
export const Application_GeoxacmlXml = new Application("geoxacml+xml", "xml");
export const Application_Gltf_Buffer = new Application("gltf-buffer");
export const Application_GmlXml = new Application("gml+xml", "gml");
export const Application_GpxXml = new Application("gpx+xml", "gpx");
export const Application_Gxf = new Application("gxf", "gxf");
export const Application_Gzip = new Application("gzip");
export const Application_H224 = new Application("h224");
export const Application_HeldXml = new Application("held+xml", "xml");
export const Application_Http = new Application("http");
export const Application_Hyperstudio = new Application("hyperstudio", "stk");
export const Application_Ibe_Key_RequestXml = new Application("ibe-key-request+xml", "xml");
export const Application_Ibe_Pkg_ReplyXml = new Application("ibe-pkg-reply+xml", "xml");
export const Application_Ibe_Pp_Data = new Application("ibe-pp-data");
export const Application_Iges = new Application("iges");
export const Application_Im_IscomposingXml = new Application("im-iscomposing+xml", "xml");
export const Application_Index = new Application("index");
export const Application_IndexCmd = new Application("index.cmd");
export const Application_IndexObj = new Application("index.obj");
export const Application_IndexResponse = new Application("index.response");
export const Application_IndexVnd = new Application("index.vnd");
export const Application_InkmlXml = new Application("inkml+xml", "ink", "inkml");
export const Application_IOTP = new Application("iotp");
export const Application_Ipfix = new Application("ipfix", "ipfix");
export const Application_Ipp = new Application("ipp");
export const Application_ISUP = new Application("isup");
export const Application_ItsXml = new Application("its+xml", "xml");
export const Application_Java_Archive = new Application("java-archive", "jar");
export const Application_Java_Serialized_Object = new Application("java-serialized-object", "ser");
export const Application_Java_Vm = new Application("java-vm", "class");
export const Application_Javascript = new Application("javascript", "js");
export const Application_Jf2feedJson = new Application("jf2feed+json", "json");
export const Application_Jose = new Application("jose");
export const Application_JoseJson = new Application("jose+json", "json");
export const Application_JrdJson = new Application("jrd+json", "json");
export const Application_Json = new Application("json", "json");
export const Application_Json_PatchJson = new Application("json-patch+json", "json");
export const Application_Json_Seq = new Application("json-seq");
export const Application_JsonmlJson = new Application("jsonml+json", "jsonml");
export const Application_Jwk_SetJson = new Application("jwk-set+json", "json");
export const Application_JwkJson = new Application("jwk+json", "json");
export const Application_Jwt = new Application("jwt");
export const Application_Kpml_RequestXml = new Application("kpml-request+xml", "xml");
export const Application_Kpml_ResponseXml = new Application("kpml-response+xml", "xml");
export const Application_LdJson = new Application("ld+json", "json");
export const Application_LgrXml = new Application("lgr+xml", "xml");
export const Application_Link_Format = new Application("link-format");
export const Application_Load_ControlXml = new Application("load-control+xml", "xml");
export const Application_LostsyncXml = new Application("lostsync+xml", "xml");
export const Application_LostXml = new Application("lost+xml", "lostxml");
export const Application_LXF = new Application("lxf");
export const Application_Mac_Binhex40 = new Application("mac-binhex40", "hqx");
export const Application_Mac_Compactpro = new Application("mac-compactpro", "cpt");
export const Application_Macwriteii = new Application("macwriteii");
export const Application_MadsXml = new Application("mads+xml", "mads");
export const Application_Marc = new Application("marc", "mrc");
export const Application_MarcxmlXml = new Application("marcxml+xml", "mrcx");
export const Application_Mathematica = new Application("mathematica", "ma", "nb", "mb");
export const Application_Mathml_ContentXml = new Application("mathml-content+xml", "xml");
export const Application_Mathml_PresentationXml = new Application("mathml-presentation+xml", "xml");
export const Application_MathmlXml = new Application("mathml+xml", "mathml");
export const Application_Mbms_Associated_Procedure_DescriptionXml = new Application("mbms-associated-procedure-description+xml", "xml");
export const Application_Mbms_DeregisterXml = new Application("mbms-deregister+xml", "xml");
export const Application_Mbms_EnvelopeXml = new Application("mbms-envelope+xml", "xml");
export const Application_Mbms_Msk_ResponseXml = new Application("mbms-msk-response+xml", "xml");
export const Application_Mbms_MskXml = new Application("mbms-msk+xml", "xml");
export const Application_Mbms_Protection_DescriptionXml = new Application("mbms-protection-description+xml", "xml");
export const Application_Mbms_Reception_ReportXml = new Application("mbms-reception-report+xml", "xml");
export const Application_Mbms_Register_ResponseXml = new Application("mbms-register-response+xml", "xml");
export const Application_Mbms_RegisterXml = new Application("mbms-register+xml", "xml");
export const Application_Mbms_ScheduleXml = new Application("mbms-schedule+xml", "xml");
export const Application_Mbms_User_Service_DescriptionXml = new Application("mbms-user-service-description+xml", "xml");
export const Application_Mbox = new Application("mbox", "mbox");
export const Application_Media_controlXml = new Application("media_control+xml", "xml");
export const Application_Media_Policy_DatasetXml = new Application("media-policy-dataset+xml", "xml");
export const Application_MediaservercontrolXml = new Application("mediaservercontrol+xml", "mscml");
export const Application_Merge_PatchJson = new Application("merge-patch+json", "json");
export const Application_Metalink4Xml = new Application("metalink4+xml", "meta4");
export const Application_MetalinkXml = new Application("metalink+xml", "metalink");
export const Application_MetsXml = new Application("mets+xml", "mets");
export const Application_MF4 = new Application("mf4");
export const Application_Mikey = new Application("mikey");
export const Application_Mipc = new Application("mipc");
export const Application_Mmt_AeiXml = new Application("mmt-aei+xml", "xml");
export const Application_Mmt_UsdXml = new Application("mmt-usd+xml", "xml");
export const Application_ModsXml = new Application("mods+xml", "mods");
export const Application_Moss_Keys = new Application("moss-keys");
export const Application_Moss_Signature = new Application("moss-signature");
export const Application_Mosskey_Data = new Application("mosskey-data");
export const Application_Mosskey_Request = new Application("mosskey-request");
export const Application_Mp21 = new Application("mp21", "m21", "mp21");
export const Application_Mp4 = new Application("mp4", "mp4s");
export const Application_Mpeg4_Generic = new Application("mpeg4-generic");
export const Application_Mpeg4_Iod = new Application("mpeg4-iod");
export const Application_Mpeg4_Iod_Xmt = new Application("mpeg4-iod-xmt");
export const Application_Mrb_ConsumerXml = new Application("mrb-consumer+xml", "xml");
export const Application_Mrb_PublishXml = new Application("mrb-publish+xml", "xml");
export const Application_Msc_IvrXml = new Application("msc-ivr+xml", "xml");
export const Application_Msc_MixerXml = new Application("msc-mixer+xml", "xml");
export const Application_Msword = new Application("msword", "doc", "dot");
export const Application_MudJson = new Application("mud+json", "json");
export const Application_Multipart_Core = new Application("multipart-core");
export const Application_Mxf = new Application("mxf", "mxf");
export const Application_N_Quads = new Application("n-quads");
export const Application_N_Triples = new Application("n-triples");
export const Application_Nasdata = new Application("nasdata");
export const Application_News_Checkgroups = new Application("news-checkgroups");
export const Application_News_Groupinfo = new Application("news-groupinfo");
export const Application_News_Transmission = new Application("news-transmission");
export const Application_NlsmlXml = new Application("nlsml+xml", "xml");
export const Application_Node = new Application("node");
export const Application_Nss = new Application("nss");
export const Application_Ocsp_Request = new Application("ocsp-request");
export const Application_Ocsp_Response = new Application("ocsp-response");
export const Application_Octet_Stream = new Application("octet-stream", "bin", "dms", "lrf", "mar", "so", "dist", "distz", "pkg", "bpk", "dump", "elc", "deploy");
export const Application_ODA = new Application("oda", "oda");
export const Application_OdmXml = new Application("odm+xml", "xml");
export const Application_ODX = new Application("odx");
export const Application_Oebps_PackageXml = new Application("oebps-package+xml", "opf");
export const Application_Ogg = new Application("ogg", "ogx");
export const Application_OmdocXml = new Application("omdoc+xml", "omdoc");
export const Application_Onenote = new Application("onenote", "onetoc", "onetoc2", "onetmp", "onepkg");
export const Application_Oscore = new Application("oscore");
export const Application_Oxps = new Application("oxps", "oxps");
export const Application_P2p_OverlayXml = new Application("p2p-overlay+xml", "xml");
export const Application_Parityfec = new Application("parityfec");
export const Application_Passport = new Application("passport");
export const Application_Patch_Ops_ErrorXml = new Application("patch-ops-error+xml", "xer");
export const Application_Pdf = new Application("pdf", "pdf");
export const Application_PDX = new Application("pdx");
export const Application_Pem_Certificate_Chain = new Application("pem-certificate-chain");
export const Application_Pgp_Encrypted = new Application("pgp-encrypted", "pgp");
export const Application_Pgp_Keys = new Application("pgp-keys");
export const Application_Pgp_Signature = new Application("pgp-signature", "asc", "sig");
export const Application_Pics_Rules = new Application("pics-rules", "prf");
export const Application_Pidf_DiffXml = new Application("pidf-diff+xml", "xml");
export const Application_PidfXml = new Application("pidf+xml", "xml");
export const Application_Pkcs10 = new Application("pkcs10", "p10");
export const Application_Pkcs12 = new Application("pkcs12");
export const Application_Pkcs7_Mime = new Application("pkcs7-mime", "p7m", "p7c");
export const Application_Pkcs7_Signature = new Application("pkcs7-signature", "p7s");
export const Application_Pkcs8 = new Application("pkcs8", "p8");
export const Application_Pkcs8_Encrypted = new Application("pkcs8-encrypted");
export const Application_Pkix_Attr_Cert = new Application("pkix-attr-cert", "ac");
export const Application_Pkix_Cert = new Application("pkix-cert", "cer");
export const Application_Pkix_Crl = new Application("pkix-crl", "crl");
export const Application_Pkix_Pkipath = new Application("pkix-pkipath", "pkipath");
export const Application_Pkixcmp = new Application("pkixcmp", "pki");
export const Application_PlsXml = new Application("pls+xml", "pls");
export const Application_Poc_SettingsXml = new Application("poc-settings+xml", "xml");
export const Application_Postscript = new Application("postscript", "ai", "eps", "ps");
export const Application_Ppsp_TrackerJson = new Application("ppsp-tracker+json", "json");
export const Application_ProblemJson = new Application("problem+json", "json");
export const Application_ProblemXml = new Application("problem+xml", "xml");
export const Application_ProvenanceXml = new Application("provenance+xml", "xml");
export const Application_PrsAlvestrandTitrax_Sheet = new Application("prs.alvestrand.titrax-sheet");
export const Application_PrsCww = new Application("prs.cww", "cww");
export const Application_PrsHpubZip = new Application("prs.hpub+zip", "zip");
export const Application_PrsNprend = new Application("prs.nprend");
export const Application_PrsPlucker = new Application("prs.plucker");
export const Application_PrsRdf_Xml_Crypt = new Application("prs.rdf-xml-crypt");
export const Application_PrsXsfXml = new Application("prs.xsf+xml", "xml");
export const Application_PskcXml = new Application("pskc+xml", "pskcxml");
export const Application_QSIG = new Application("qsig");
export const Application_Raptorfec = new Application("raptorfec");
export const Application_RdapJson = new Application("rdap+json", "json");
export const Application_RdfXml = new Application("rdf+xml", "rdf");
export const Application_ReginfoXml = new Application("reginfo+xml", "rif");
export const Application_Relax_Ng_Compact_Syntax = new Application("relax-ng-compact-syntax", "rnc");
export const Application_Remote_Printing = new Application("remote-printing");
export const Application_ReputonJson = new Application("reputon+json", "json");
export const Application_Resource_Lists_DiffXml = new Application("resource-lists-diff+xml", "rld");
export const Application_Resource_ListsXml = new Application("resource-lists+xml", "rl");
export const Application_RfcXml = new Application("rfc+xml", "xml");
export const Application_Riscos = new Application("riscos");
export const Application_RlmiXml = new Application("rlmi+xml", "xml");
export const Application_Rls_ServicesXml = new Application("rls-services+xml", "rs");
export const Application_Route_ApdXml = new Application("route-apd+xml", "xml");
export const Application_Route_S_TsidXml = new Application("route-s-tsid+xml", "xml");
export const Application_Route_UsdXml = new Application("route-usd+xml", "xml");
export const Application_Rpki_Ghostbusters = new Application("rpki-ghostbusters", "gbr");
export const Application_Rpki_Manifest = new Application("rpki-manifest", "mft");
export const Application_Rpki_Publication = new Application("rpki-publication");
export const Application_Rpki_Roa = new Application("rpki-roa", "roa");
export const Application_Rpki_Updown = new Application("rpki-updown");
export const Application_RsdXml = new Application("rsd+xml", "rsd");
export const Application_RssXml = new Application("rss+xml", "rss");
export const Application_Rtf = new Application("rtf", "rtf");
export const Application_Rtploopback = new Application("rtploopback");
export const Application_Rtx = new Application("rtx");
export const Application_SamlassertionXml = new Application("samlassertion+xml", "xml");
export const Application_SamlmetadataXml = new Application("samlmetadata+xml", "xml");
export const Application_SbmlXml = new Application("sbml+xml", "sbml");
export const Application_ScaipXml = new Application("scaip+xml", "xml");
export const Application_ScimJson = new Application("scim+json", "json");
export const Application_Scvp_Cv_Request = new Application("scvp-cv-request", "scq");
export const Application_Scvp_Cv_Response = new Application("scvp-cv-response", "scs");
export const Application_Scvp_Vp_Request = new Application("scvp-vp-request", "spq");
export const Application_Scvp_Vp_Response = new Application("scvp-vp-response", "spp");
export const Application_Sdp = new Application("sdp", "sdp");
export const Application_SeceventJwt = new Application("secevent+jwt", "jwt");
export const Application_Senml_Exi = new Application("senml-exi");
export const Application_SenmlCbor = new Application("senml+cbor", "cbor");
export const Application_SenmlJson = new Application("senml+json", "json");
export const Application_SenmlXml = new Application("senml+xml", "xml");
export const Application_Sensml_Exi = new Application("sensml-exi");
export const Application_SensmlCbor = new Application("sensml+cbor", "cbor");
export const Application_SensmlJson = new Application("sensml+json", "json");
export const Application_SensmlXml = new Application("sensml+xml", "xml");
export const Application_Sep_Exi = new Application("sep-exi");
export const Application_SepXml = new Application("sep+xml", "xml");
export const Application_Session_Info = new Application("session-info");
export const Application_Set_Payment = new Application("set-payment");
export const Application_Set_Payment_Initiation = new Application("set-payment-initiation", "setpay");
export const Application_Set_Registration = new Application("set-registration");
export const Application_Set_Registration_Initiation = new Application("set-registration-initiation", "setreg");
export const Application_SGML = new Application("sgml");
export const Application_Sgml_Open_Catalog = new Application("sgml-open-catalog");
export const Application_ShfXml = new Application("shf+xml", "shf");
export const Application_Sieve = new Application("sieve");
export const Application_Simple_FilterXml = new Application("simple-filter+xml", "xml");
export const Application_Simple_Message_Summary = new Application("simple-message-summary");
export const Application_SimpleSymbolContainer = new Application("simplesymbolcontainer");
export const Application_Sipc = new Application("sipc");
export const Application_Slate = new Application("slate");

//[System.Obsolete("OBSOLETED in favor of application/smil+xml")];
export const Application_Smil = new Application("smil");

export const Application_SmilXml = new Application("smil+xml", "smi", "smil");
export const Application_Smpte336m = new Application("smpte336m");
export const Application_SoapFastinfoset = new Application("soap+fastinfoset", "fastinfoset");
export const Application_SoapXml = new Application("soap+xml", "xml");
export const Application_Sparql_Query = new Application("sparql-query", "rq");
export const Application_Sparql_ResultsXml = new Application("sparql-results+xml", "srx");
export const Application_Spirits_EventXml = new Application("spirits-event+xml", "xml");
export const Application_Sql = new Application("sql");
export const Application_Srgs = new Application("srgs", "gram");
export const Application_SrgsXml = new Application("srgs+xml", "grxml");
export const Application_SruXml = new Application("sru+xml", "sru");
export const Application_SsdlXml = new Application("ssdl+xml", "ssdl");
export const Application_SsmlXml = new Application("ssml+xml", "ssml");
export const Application_StixJson = new Application("stix+json", "json");
export const Application_SwidXml = new Application("swid+xml", "xml");
export const Application_Tamp_Apex_Update = new Application("tamp-apex-update");
export const Application_Tamp_Apex_Update_Confirm = new Application("tamp-apex-update-confirm");
export const Application_Tamp_Community_Update = new Application("tamp-community-update");
export const Application_Tamp_Community_Update_Confirm = new Application("tamp-community-update-confirm");
export const Application_Tamp_Error = new Application("tamp-error");
export const Application_Tamp_Sequence_Adjust = new Application("tamp-sequence-adjust");
export const Application_Tamp_Sequence_Adjust_Confirm = new Application("tamp-sequence-adjust-confirm");
export const Application_Tamp_Status_Query = new Application("tamp-status-query");
export const Application_Tamp_Status_Response = new Application("tamp-status-response");
export const Application_Tamp_Update = new Application("tamp-update");
export const Application_Tamp_Update_Confirm = new Application("tamp-update-confirm");
export const Application_TaxiiJson = new Application("taxii+json", "json");
export const Application_TeiXml = new Application("tei+xml", "tei", "teicorpus");
export const Application_TETRA_ISI = new Application("tetra_isi");
export const Application_ThraudXml = new Application("thraud+xml", "tfi");
export const Application_Timestamp_Query = new Application("timestamp-query");
export const Application_Timestamp_Reply = new Application("timestamp-reply");
export const Application_Timestamped_Data = new Application("timestamped-data", "tsd");
export const Application_TlsrptGzip = new Application("tlsrpt+gzip", "gzip");
export const Application_TlsrptJson = new Application("tlsrpt+json", "json");
export const Application_Tnauthlist = new Application("tnauthlist");
export const Application_Trickle_Ice_Sdpfrag = new Application("trickle-ice-sdpfrag");
export const Application_Trig = new Application("trig");
export const Application_TtmlXml = new Application("ttml+xml", "xml");
export const Application_Tve_Trigger = new Application("tve-trigger");
export const Application_Tzif = new Application("tzif");
export const Application_Tzif_Leap = new Application("tzif-leap");
export const Application_Ulpfec = new Application("ulpfec");
export const Application_Urc_GrpsheetXml = new Application("urc-grpsheet+xml", "xml");
export const Application_Urc_RessheetXml = new Application("urc-ressheet+xml", "xml");
export const Application_Urc_TargetdescXml = new Application("urc-targetdesc+xml", "xml");
export const Application_Urc_UisocketdescXml = new Application("urc-uisocketdesc+xml", "xml");
export const Application_VcardJson = new Application("vcard+json", "json");
export const Application_VcardXml = new Application("vcard+xml", "xml");
export const Application_Vemmi = new Application("vemmi");
export const Application_Vendor1000mindsDecision_ModelXml = new Application("vnd.1000minds.decision-model+xml", "xml");
export const Application_Vendor1d_Interleaved_Parityfec = new Application("1d-interleaved-parityfec");
export const Application_Vendor3gpdash_Qoe_ReportXml = new Application("3gpdash-qoe-report+xml", "xml");
export const Application_Vendor3gpp_ImsXml = new Application("3gpp-ims+xml", "xml");
export const Application_Vendor3gpp_Prose_Pc3chXml = new Application("vnd.3gpp-prose-pc3ch+xml", "xml");
export const Application_Vendor3gpp_ProseXml = new Application("vnd.3gpp-prose+xml", "xml");
export const Application_Vendor3gpp_V2x_Local_Service_Information = new Application("vnd.3gpp-v2x-local-service-information");
export const Application_Vendor3gpp2BcmcsinfoXml = new Application("vnd.3gpp2.bcmcsinfo+xml", "xml");
export const Application_Vendor3gpp2Sms = new Application("vnd.3gpp2.sms");
export const Application_Vendor3gpp2Tcap = new Application("vnd.3gpp2.tcap", "tcap");
export const Application_Vendor3gppAccess_Transfer_EventsXml = new Application("vnd.3gpp.access-transfer-events+xml", "xml");
export const Application_Vendor3gppBsfXml = new Application("vnd.3gpp.bsf+xml", "xml");
export const Application_Vendor3gppGMOPXml = new Application("vnd.3gpp.gmop+xml", "xml");
export const Application_Vendor3gppMc_Signalling_Ear = new Application("vnd.3gpp.mc-signalling-ear");
export const Application_Vendor3gppMcdata_Affiliation_CommandXml = new Application("vnd.3gpp.mcdata-affiliation-command+xml", "xml");
export const Application_Vendor3gppMcdata_InfoXml = new Application("vnd.3gpp.mcdata-info+xml", "xml");
export const Application_Vendor3gppMcdata_Payload = new Application("vnd.3gpp.mcdata-payload");
export const Application_Vendor3gppMcdata_Service_ConfigXml = new Application("vnd.3gpp.mcdata-service-config+xml", "xml");
export const Application_Vendor3gppMcdata_Signalling = new Application("vnd.3gpp.mcdata-signalling");
export const Application_Vendor3gppMcdata_Ue_ConfigXml = new Application("vnd.3gpp.mcdata-ue-config+xml", "xml");
export const Application_Vendor3gppMcdata_User_ProfileXml = new Application("vnd.3gpp.mcdata-user-profile+xml", "xml");
export const Application_Vendor3gppMcptt_Affiliation_CommandXml = new Application("vnd.3gpp.mcptt-affiliation-command+xml", "xml");
export const Application_Vendor3gppMcptt_Floor_RequestXml = new Application("vnd.3gpp.mcptt-floor-request+xml", "xml");
export const Application_Vendor3gppMcptt_InfoXml = new Application("vnd.3gpp.mcptt-info+xml", "xml");
export const Application_Vendor3gppMcptt_Location_InfoXml = new Application("vnd.3gpp.mcptt-location-info+xml", "xml");
export const Application_Vendor3gppMcptt_Mbms_Usage_InfoXml = new Application("vnd.3gpp.mcptt-mbms-usage-info+xml", "xml");
export const Application_Vendor3gppMcptt_Service_ConfigXml = new Application("vnd.3gpp.mcptt-service-config+xml", "xml");
export const Application_Vendor3gppMcptt_SignedXml = new Application("vnd.3gpp.mcptt-signed+xml", "xml");
export const Application_Vendor3gppMcptt_Ue_ConfigXml = new Application("vnd.3gpp.mcptt-ue-config+xml", "xml");
export const Application_Vendor3gppMcptt_Ue_Init_ConfigXml = new Application("vnd.3gpp.mcptt-ue-init-config+xml", "xml");
export const Application_Vendor3gppMcptt_User_ProfileXml = new Application("vnd.3gpp.mcptt-user-profile+xml", "xml");
export const Application_Vendor3gppMcvideo_Affiliation_CommandXml = new Application("vnd.3gpp.mcvideo-affiliation-command+xml", "xml");

//[System.Obsolete("OBSOLETED in favor of application/vnd.3gpp.mcvideo-info+xml")];
export const Application_Vendor3gppMcvideo_Affiliation_InfoXml = new Application("vnd.3gpp.mcvideo-affiliation-info+xml", "xml");

export const Application_Vendor3gppMcvideo_InfoXml = new Application("vnd.3gpp.mcvideo-info+xml", "xml");
export const Application_Vendor3gppMcvideo_Location_InfoXml = new Application("vnd.3gpp.mcvideo-location-info+xml", "xml");
export const Application_Vendor3gppMcvideo_Mbms_Usage_InfoXml = new Application("vnd.3gpp.mcvideo-mbms-usage-info+xml", "xml");
export const Application_Vendor3gppMcvideo_Service_ConfigXml = new Application("vnd.3gpp.mcvideo-service-config+xml", "xml");
export const Application_Vendor3gppMcvideo_Transmission_RequestXml = new Application("vnd.3gpp.mcvideo-transmission-request+xml", "xml");
export const Application_Vendor3gppMcvideo_Ue_ConfigXml = new Application("vnd.3gpp.mcvideo-ue-config+xml", "xml");
export const Application_Vendor3gppMcvideo_User_ProfileXml = new Application("vnd.3gpp.mcvideo-user-profile+xml", "xml");
export const Application_Vendor3gppMid_CallXml = new Application("vnd.3gpp.mid-call+xml", "xml");
export const Application_Vendor3gppPic_Bw_Large = new Application("vnd.3gpp.pic-bw-large", "plb");
export const Application_Vendor3gppPic_Bw_Small = new Application("vnd.3gpp.pic-bw-small", "psb");
export const Application_Vendor3gppPic_Bw_Var = new Application("vnd.3gpp.pic-bw-var", "pvb");
export const Application_Vendor3gppSms = new Application("vnd.3gpp.sms");
export const Application_Vendor3gppSmsXml = new Application("vnd.3gpp.sms+xml", "xml");
export const Application_Vendor3gppSrvcc_ExtXml = new Application("vnd.3gpp.srvcc-ext+xml", "xml");
export const Application_Vendor3gppSRVCC_InfoXml = new Application("vnd.3gpp.srvcc-info+xml", "xml");
export const Application_Vendor3gppState_And_Event_InfoXml = new Application("vnd.3gpp.state-and-event-info+xml", "xml");
export const Application_Vendor3gppUssdXml = new Application("vnd.3gpp.ussd+xml", "xml");
export const Application_Vendor3lightssoftwareImagescal = new Application("vnd.3lightssoftware.imagescal");
export const Application_Vendor3MPost_It_Notes = new Application("vnd.3m.post-it-notes", "pwn");
export const Application_VendorAccpacSimplyAso = new Application("vnd.accpac.simply.aso", "aso");
export const Application_VendorAccpacSimplyImp = new Application("vnd.accpac.simply.imp", "imp");
export const Application_VendorAcucobol = new Application("vnd.acucobol", "acu");
export const Application_VendorAcucorp = new Application("vnd.acucorp", "atc", "acutc");
export const Application_VendorAdobeAir_Application_Installer_PackageZip = new Application("vnd.adobe.air-application-installer-package+zip", "air");
export const Application_VendorAdobeFlashMovie = new Application("vnd.adobe.flash.movie");
export const Application_VendorAdobeFormscentralFcdt = new Application("vnd.adobe.formscentral.fcdt", "fcdt");
export const Application_VendorAdobeFxp = new Application("vnd.adobe.fxp", "fxp", "fxpl");
export const Application_VendorAdobePartial_Upload = new Application("vnd.adobe.partial-upload");
export const Application_VendorAdobeXdpXml = new Application("vnd.adobe.xdp+xml", "xdp");
export const Application_VendorAdobeXfdf = new Application("vnd.adobe.xfdf", "xfdf");
export const Application_VendorAetherImp = new Application("vnd.aether.imp");
export const Application_VendorAfpcAfplinedata = new Application("vnd.afpc.afplinedata");
export const Application_VendorAfpcAfplinedata_Pagedef = new Application("vnd.afpc.afplinedata-pagedef");
export const Application_VendorAfpcFoca_Charset = new Application("vnd.afpc.foca-charset");
export const Application_VendorAfpcFoca_Codedfont = new Application("vnd.afpc.foca-codedfont");
export const Application_VendorAfpcFoca_Codepage = new Application("vnd.afpc.foca-codepage");
export const Application_VendorAfpcModca = new Application("vnd.afpc.modca");
export const Application_VendorAfpcModca_Formdef = new Application("vnd.afpc.modca-formdef");
export const Application_VendorAfpcModca_Mediummap = new Application("vnd.afpc.modca-mediummap");
export const Application_VendorAfpcModca_Objectcontainer = new Application("vnd.afpc.modca-objectcontainer");
export const Application_VendorAfpcModca_Overlay = new Application("vnd.afpc.modca-overlay");
export const Application_VendorAfpcModca_Pagesegment = new Application("vnd.afpc.modca-pagesegment");
export const Application_VendorAh_Barcode = new Application("vnd.ah-barcode");
export const Application_VendorAheadSpace = new Application("vnd.ahead.space", "ahead");
export const Application_VendorAirzipFilesecureAzf = new Application("vnd.airzip.filesecure.azf", "azf");
export const Application_VendorAirzipFilesecureAzs = new Application("vnd.airzip.filesecure.azs", "azs");
export const Application_VendorAmadeusJson = new Application("vnd.amadeus+json", "json");
export const Application_VendorAmazonEbook = new Application("vnd.amazon.ebook", "azw");
export const Application_VendorAmazonMobi8_Ebook = new Application("vnd.amazon.mobi8-ebook");
export const Application_VendorAmericandynamicsAcc = new Application("vnd.americandynamics.acc", "acc");
export const Application_VendorAmigaAmi = new Application("vnd.amiga.ami", "ami");
export const Application_VendorAmundsenMazeXml = new Application("vnd.amundsen.maze+xml", "xml");
export const Application_VendorAndroidOta = new Application("vnd.android.ota");
export const Application_VendorAndroidPackage_Archive = new Application("vnd.android.package-archive", "apk");
export const Application_VendorAnki = new Application("vnd.anki");
export const Application_VendorAnser_Web_Certificate_Issue_Initiation = new Application("vnd.anser-web-certificate-issue-initiation", "cii");
export const Application_VendorAnser_Web_Funds_Transfer_Initiation = new Application("vnd.anser-web-funds-transfer-initiation", "fti");
export const Application_VendorAntixGame_Component = new Application("vnd.antix.game-component", "atx");
export const Application_VendorApacheThriftBinary = new Application("vnd.apache.thrift.binary");
export const Application_VendorApacheThriftCompact = new Application("vnd.apache.thrift.compact");
export const Application_VendorApacheThriftJson = new Application("vnd.apache.thrift.json");
export const Application_VendorApiJson = new Application("vnd.api+json", "json");
export const Application_VendorAplextorWarrpJson = new Application("vnd.aplextor.warrp+json", "json");
export const Application_VendorApothekendeReservationJson = new Application("vnd.apothekende.reservation+json", "json");
export const Application_VendorAppleInstallerXml = new Application("vnd.apple.installer+xml", "mpkg");
export const Application_VendorAppleKeynote = new Application("vnd.apple.keynote");
export const Application_VendorAppleMpegurl = new Application("vnd.apple.mpegurl", "m3u8");
export const Application_VendorAppleNumbers = new Application("vnd.apple.numbers");
export const Application_VendorApplePages = new Application("vnd.apple.pages");

//[System.Obsolete("OBSOLETED in favor of application/vnd.aristanetworks.swi")];
export const Application_VendorArastraSwi = new Application("vnd.arastra.swi");

export const Application_VendorAristanetworksSwi = new Application("vnd.aristanetworks.swi", "swi");
export const Application_VendorArtisanJson = new Application("vnd.artisan+json", "json");
export const Application_VendorArtsquare = new Application("vnd.artsquare");
export const Application_VendorAstraea_SoftwareIota = new Application("vnd.astraea-software.iota", "iota");
export const Application_VendorAudiograph = new Application("vnd.audiograph", "aep");
export const Application_VendorAutopackage = new Application("vnd.autopackage");
export const Application_VendorAvalonJson = new Application("vnd.avalon+json", "json");
export const Application_VendorAvistarXml = new Application("vnd.avistar+xml", "xml");
export const Application_VendorBalsamiqBmmlXml = new Application("vnd.balsamiq.bmml+xml", "xml");
export const Application_VendorBalsamiqBmpr = new Application("vnd.balsamiq.bmpr");
export const Application_VendorBanana_Accounting = new Application("vnd.banana-accounting");
export const Application_VendorBbfUspError = new Application("vnd.bbf.usp.error");
export const Application_VendorBbfUspMsg = new Application("vnd.bbf.usp.msg");
export const Application_VendorBbfUspMsgJson = new Application("vnd.bbf.usp.msg+json", "json");
export const Application_VendorBekitzur_StechJson = new Application("vnd.bekitzur-stech+json", "json");
export const Application_VendorBintMed_Content = new Application("vnd.bint.med-content");
export const Application_VendorBiopaxRdfXml = new Application("vnd.biopax.rdf+xml", "xml");
export const Application_VendorBlink_Idb_Value_Wrapper = new Application("vnd.blink-idb-value-wrapper");
export const Application_VendorBlueiceMultipass = new Application("vnd.blueice.multipass", "mpm");
export const Application_VendorBluetoothEpOob = new Application("vnd.bluetooth.ep.oob");
export const Application_VendorBluetoothLeOob = new Application("vnd.bluetooth.le.oob");
export const Application_VendorBmi = new Application("vnd.bmi", "bmi");
export const Application_VendorBpf = new Application("vnd.bpf");
export const Application_VendorBpf3 = new Application("vnd.bpf3");
export const Application_VendorBusinessobjects = new Application("vnd.businessobjects", "rep");
export const Application_VendorByuUapiJson = new Application("vnd.byu.uapi+json", "json");
export const Application_VendorCab_Jscript = new Application("vnd.cab-jscript");
export const Application_VendorCanon_Cpdl = new Application("vnd.canon-cpdl");
export const Application_VendorCanon_Lips = new Application("vnd.canon-lips");
export const Application_VendorCapasystems_PgJson = new Application("vnd.capasystems-pg+json", "json");
export const Application_VendorCendioThinlincClientconf = new Application("vnd.cendio.thinlinc.clientconf");
export const Application_VendorCentury_SystemsTcp_stream = new Application("vnd.century-systems.tcp_stream");
export const Application_VendorChemdrawXml = new Application("vnd.chemdraw+xml", "cdxml");
export const Application_VendorChess_Pgn = new Application("vnd.chess-pgn");
export const Application_VendorChipnutsKaraoke_Mmd = new Application("vnd.chipnuts.karaoke-mmd", "mmd");
export const Application_VendorCiedi = new Application("vnd.ciedi");
export const Application_VendorCinderella = new Application("vnd.cinderella", "cdy");
export const Application_VendorCirpackIsdn_Ext = new Application("vnd.cirpack.isdn-ext");
export const Application_VendorCitationstylesStyleXml = new Application("vnd.citationstyles.style+xml", "xml");
export const Application_VendorClaymore = new Application("vnd.claymore", "cla");
export const Application_VendorCloantoRp9 = new Application("vnd.cloanto.rp9", "rp9");
export const Application_VendorClonkC4group = new Application("vnd.clonk.c4group", "c4g", "c4d", "c4f", "c4p", "c4u");
export const Application_VendorCluetrustCartomobile_Config = new Application("vnd.cluetrust.cartomobile-config", "c11amc");
export const Application_VendorCluetrustCartomobile_Config_Pkg = new Application("vnd.cluetrust.cartomobile-config-pkg", "c11amz");
export const Application_VendorCoffeescript = new Application("vnd.coffeescript");
export const Application_VendorCollabioXodocumentsDocument = new Application("vnd.collabio.xodocuments.document");
export const Application_VendorCollabioXodocumentsDocument_Template = new Application("vnd.collabio.xodocuments.document-template");
export const Application_VendorCollabioXodocumentsPresentation = new Application("vnd.collabio.xodocuments.presentation");
export const Application_VendorCollabioXodocumentsPresentation_Template = new Application("vnd.collabio.xodocuments.presentation-template");
export const Application_VendorCollabioXodocumentsSpreadsheet = new Application("vnd.collabio.xodocuments.spreadsheet");
export const Application_VendorCollabioXodocumentsSpreadsheet_Template = new Application("vnd.collabio.xodocuments.spreadsheet-template");
export const Application_VendorCollectionDocJson = new Application("vnd.collection.doc+json", "json");
export const Application_VendorCollectionJson = new Application("vnd.collection+json", "json");
export const Application_VendorCollectionNextJson = new Application("vnd.collection.next+json", "json");
export const Application_VendorComicbook_Rar = new Application("vnd.comicbook-rar");
export const Application_VendorComicbookZip = new Application("vnd.comicbook+zip", "zip");
export const Application_VendorCommerce_Battelle = new Application("vnd.commerce-battelle");
export const Application_VendorCommonspace = new Application("vnd.commonspace", "csp");
export const Application_VendorContactCmsg = new Application("vnd.contact.cmsg", "cdbcmsg");
export const Application_VendorCoreosIgnitionJson = new Application("vnd.coreos.ignition+json", "json");
export const Application_VendorCosmocaller = new Application("vnd.cosmocaller", "cmc");
export const Application_VendorCrickClicker = new Application("vnd.crick.clicker", "clkx");
export const Application_VendorCrickClickerKeyboard = new Application("vnd.crick.clicker.keyboard", "clkk");
export const Application_VendorCrickClickerPalette = new Application("vnd.crick.clicker.palette", "clkp");
export const Application_VendorCrickClickerTemplate = new Application("vnd.crick.clicker.template", "clkt");
export const Application_VendorCrickClickerWordbank = new Application("vnd.crick.clicker.wordbank", "clkw");
export const Application_VendorCriticaltoolsWbsXml = new Application("vnd.criticaltools.wbs+xml", "wbs");
export const Application_VendorCryptiiPipeJson = new Application("vnd.cryptii.pipe+json", "json");
export const Application_VendorCrypto_Shade_File = new Application("vnd.crypto-shade-file");
export const Application_VendorCtc_Posml = new Application("vnd.ctc-posml", "pml");
export const Application_VendorCtctWsXml = new Application("vnd.ctct.ws+xml", "xml");
export const Application_VendorCups_Pdf = new Application("vnd.cups-pdf");
export const Application_VendorCups_Postscript = new Application("vnd.cups-postscript");
export const Application_VendorCups_Ppd = new Application("vnd.cups-ppd", "ppd");
export const Application_VendorCups_Raster = new Application("vnd.cups-raster");
export const Application_VendorCups_Raw = new Application("vnd.cups-raw");
export const Application_VendorCurl = new Application("vnd.curl");
export const Application_VendorCurlCar = new Application("vnd.curl.car", "car");
export const Application_VendorCurlPcurl = new Application("vnd.curl.pcurl", "pcurl");
export const Application_VendorCyanDeanRootXml = new Application("vnd.cyan.dean.root+xml", "xml");
export const Application_VendorCybank = new Application("vnd.cybank");
export const Application_VendorD2lCoursepackage1p0Zip = new Application("vnd.d2l.coursepackage1p0+zip", "zip");
export const Application_VendorDart = new Application("vnd.dart", "dart");
export const Application_VendorData_VisionRdz = new Application("vnd.data-vision.rdz", "rdz");
export const Application_VendorDatapackageJson = new Application("vnd.datapackage+json", "json");
export const Application_VendorDataresourceJson = new Application("vnd.dataresource+json", "json");
export const Application_VendorDebianBinary_Package = new Application("vnd.debian.binary-package");
export const Application_VendorDeceData = new Application("vnd.dece.data", "uvf", "uvvf", "uvd", "uvvd");
export const Application_VendorDeceTtmlXml = new Application("vnd.dece.ttml+xml", "uvt", "uvvt");
export const Application_VendorDeceUnspecified = new Application("vnd.dece.unspecified", "uvx", "uvvx");
export const Application_VendorDeceZip = new Application("vnd.dece.zip", "uvz", "uvvz");
export const Application_VendorDenovoFcselayout_Link = new Application("vnd.denovo.fcselayout-link", "fe_launch");
export const Application_VendorDesmumeMovie = new Application("vnd.desmume.movie");
export const Application_VendorDir_BiPlate_Dl_Nosuffix = new Application("vnd.dir-bi.plate-dl-nosuffix");
export const Application_VendorDmDelegationXml = new Application("vnd.dm.delegation+xml", "xml");
export const Application_VendorDna = new Application("vnd.dna", "dna");
export const Application_VendorDocumentJson = new Application("vnd.document+json", "json");
export const Application_VendorDolbyMlp = new Application("vnd.dolby.mlp", "mlp");
export const Application_VendorDolbyMobile1 = new Application("vnd.dolby.mobile.1");
export const Application_VendorDolbyMobile2 = new Application("vnd.dolby.mobile.2");
export const Application_VendorDoremirScorecloud_Binary_Document = new Application("vnd.doremir.scorecloud-binary-document");
export const Application_VendorDpgraph = new Application("vnd.dpgraph", "dpg");
export const Application_VendorDreamfactory = new Application("vnd.dreamfactory", "dfac");
export const Application_VendorDriveJson = new Application("vnd.drive+json", "json");
export const Application_VendorDs_Keypoint = new Application("vnd.ds-keypoint", "kpxx");
export const Application_VendorDtgLocal = new Application("vnd.dtg.local");
export const Application_VendorDtgLocalFlash = new Application("vnd.dtg.local.flash");
export const Application_VendorDtgLocalHtml = new Application("vnd.dtg.local.html");
export const Application_VendorDvbAit = new Application("vnd.dvb.ait", "ait");
export const Application_VendorDvbDvbj = new Application("vnd.dvb.dvbj");
export const Application_VendorDvbEsgcontainer = new Application("vnd.dvb.esgcontainer");
export const Application_VendorDvbIpdcdftnotifaccess = new Application("vnd.dvb.ipdcdftnotifaccess");
export const Application_VendorDvbIpdcesgaccess = new Application("vnd.dvb.ipdcesgaccess");
export const Application_VendorDvbIpdcesgaccess2 = new Application("vnd.dvb.ipdcesgaccess2");
export const Application_VendorDvbIpdcesgpdd = new Application("vnd.dvb.ipdcesgpdd");
export const Application_VendorDvbIpdcroaming = new Application("vnd.dvb.ipdcroaming");
export const Application_VendorDvbIptvAlfec_Base = new Application("vnd.dvb.iptv.alfec-base");
export const Application_VendorDvbIptvAlfec_Enhancement = new Application("vnd.dvb.iptv.alfec-enhancement");
export const Application_VendorDvbNotif_Aggregate_RootXml = new Application("vnd.dvb.notif-aggregate-root+xml", "xml");
export const Application_VendorDvbNotif_ContainerXml = new Application("vnd.dvb.notif-container+xml", "xml");
export const Application_VendorDvbNotif_GenericXml = new Application("vnd.dvb.notif-generic+xml", "xml");
export const Application_VendorDvbNotif_Ia_MsglistXml = new Application("vnd.dvb.notif-ia-msglist+xml", "xml");
export const Application_VendorDvbNotif_Ia_Registration_RequestXml = new Application("vnd.dvb.notif-ia-registration-request+xml", "xml");
export const Application_VendorDvbNotif_Ia_Registration_ResponseXml = new Application("vnd.dvb.notif-ia-registration-response+xml", "xml");
export const Application_VendorDvbNotif_InitXml = new Application("vnd.dvb.notif-init+xml", "xml");
export const Application_VendorDvbPfr = new Application("vnd.dvb.pfr");
export const Application_VendorDvbService = new Application("vnd.dvb.service", "svc");
export const Application_VendorDxr = new Application("vnd.dxr");
export const Application_VendorDynageo = new Application("vnd.dynageo", "geo");
export const Application_VendorDzr = new Application("vnd.dzr");
export const Application_VendorEasykaraokeCdgdownload = new Application("vnd.easykaraoke.cdgdownload");
export const Application_VendorEcdis_Update = new Application("vnd.ecdis-update");
export const Application_VendorEcipRlp = new Application("vnd.ecip.rlp");
export const Application_VendorEcowinChart = new Application("vnd.ecowin.chart", "mag");
export const Application_VendorEcowinFilerequest = new Application("vnd.ecowin.filerequest");
export const Application_VendorEcowinFileupdate = new Application("vnd.ecowin.fileupdate");
export const Application_VendorEcowinSeries = new Application("vnd.ecowin.series");
export const Application_VendorEcowinSeriesrequest = new Application("vnd.ecowin.seriesrequest");
export const Application_VendorEcowinSeriesupdate = new Application("vnd.ecowin.seriesupdate");
export const Application_VendorEfiImg = new Application("vnd.efi.img");
export const Application_VendorEfiIso = new Application("vnd.efi.iso");
export const Application_VendorEmclientAccessrequestXml = new Application("vnd.emclient.accessrequest+xml", "xml");
export const Application_VendorEnliven = new Application("vnd.enliven", "nml");
export const Application_VendorEnphaseEnvoy = new Application("vnd.enphase.envoy");
export const Application_VendorEprintsDataXml = new Application("vnd.eprints.data+xml", "xml");
export const Application_VendorEpsonEsf = new Application("vnd.epson.esf", "esf");
export const Application_VendorEpsonMsf = new Application("vnd.epson.msf", "msf");
export const Application_VendorEpsonQuickanime = new Application("vnd.epson.quickanime", "qam");
export const Application_VendorEpsonSalt = new Application("vnd.epson.salt", "slt");
export const Application_VendorEpsonSsf = new Application("vnd.epson.ssf", "ssf");
export const Application_VendorEricssonQuickcall = new Application("vnd.ericsson.quickcall");
export const Application_VendorEspass_EspassZip = new Application("vnd.espass-espass+zip", "zip");
export const Application_VendorEszigno3Xml = new Application("vnd.eszigno3+xml", "es3", "et3");
export const Application_VendorEtsiAocXml = new Application("vnd.etsi.aoc+xml", "xml");
export const Application_VendorEtsiAsic_EZip = new Application("vnd.etsi.asic-e+zip", "zip");
export const Application_VendorEtsiAsic_SZip = new Application("vnd.etsi.asic-s+zip", "zip");
export const Application_VendorEtsiCugXml = new Application("vnd.etsi.cug+xml", "xml");
export const Application_VendorEtsiIptvcommandXml = new Application("vnd.etsi.iptvcommand+xml", "xml");
export const Application_VendorEtsiIptvdiscoveryXml = new Application("vnd.etsi.iptvdiscovery+xml", "xml");
export const Application_VendorEtsiIptvprofileXml = new Application("vnd.etsi.iptvprofile+xml", "xml");
export const Application_VendorEtsiIptvsad_BcXml = new Application("vnd.etsi.iptvsad-bc+xml", "xml");
export const Application_VendorEtsiIptvsad_CodXml = new Application("vnd.etsi.iptvsad-cod+xml", "xml");
export const Application_VendorEtsiIptvsad_NpvrXml = new Application("vnd.etsi.iptvsad-npvr+xml", "xml");
export const Application_VendorEtsiIptvserviceXml = new Application("vnd.etsi.iptvservice+xml", "xml");
export const Application_VendorEtsiIptvsyncXml = new Application("vnd.etsi.iptvsync+xml", "xml");
export const Application_VendorEtsiIptvueprofileXml = new Application("vnd.etsi.iptvueprofile+xml", "xml");
export const Application_VendorEtsiMcidXml = new Application("vnd.etsi.mcid+xml", "xml");
export const Application_VendorEtsiMheg5 = new Application("vnd.etsi.mheg5");
export const Application_VendorEtsiOverload_Control_Policy_DatasetXml = new Application("vnd.etsi.overload-control-policy-dataset+xml", "xml");
export const Application_VendorEtsiPstnXml = new Application("vnd.etsi.pstn+xml", "xml");
export const Application_VendorEtsiSciXml = new Application("vnd.etsi.sci+xml", "xml");
export const Application_VendorEtsiSimservsXml = new Application("vnd.etsi.simservs+xml", "xml");
export const Application_VendorEtsiTimestamp_Token = new Application("vnd.etsi.timestamp-token");
export const Application_VendorEtsiTslDer = new Application("vnd.etsi.tsl.der");
export const Application_VendorEtsiTslXml = new Application("vnd.etsi.tsl+xml", "xml");
export const Application_VendorEudoraData = new Application("vnd.eudora.data");
export const Application_VendorEvolvEcigProfile = new Application("vnd.evolv.ecig.profile");
export const Application_VendorEvolvEcigSettings = new Application("vnd.evolv.ecig.settings");
export const Application_VendorEvolvEcigTheme = new Application("vnd.evolv.ecig.theme");
export const Application_VendorExstream_EmpowerZip = new Application("vnd.exstream-empower+zip", "zip");
export const Application_VendorExstream_Package = new Application("vnd.exstream-package");
export const Application_VendorEzpix_Album = new Application("vnd.ezpix-album", "ez2");
export const Application_VendorEzpix_Package = new Application("vnd.ezpix-package", "ez3");
export const Application_VendorF_SecureMobile = new Application("vnd.f-secure.mobile");
export const Application_VendorFastcopy_Disk_Image = new Application("vnd.fastcopy-disk-image");
export const Application_VendorFdf = new Application("vnd.fdf", "fdf");
export const Application_VendorFdsnMseed = new Application("vnd.fdsn.mseed", "mseed");
export const Application_VendorFdsnSeed = new Application("vnd.fdsn.seed", "seed", "dataless");
export const Application_VendorFfsns = new Application("vnd.ffsns");
export const Application_VendorFiclabFlbZip = new Application("vnd.ficlab.flb+zip", "zip");
export const Application_VendorFilmitZfc = new Application("vnd.filmit.zfc");
export const Application_VendorFints = new Application("vnd.fints");
export const Application_VendorFiremonkeysCloudcell = new Application("vnd.firemonkeys.cloudcell");
export const Application_VendorFloGraphIt = new Application("vnd.flographit", "gph");
export const Application_VendorFluxtimeClip = new Application("vnd.fluxtime.clip", "ftc");
export const Application_VendorFont_Fontforge_Sfd = new Application("vnd.font-fontforge-sfd");
export const Application_VendorFramemaker = new Application("vnd.framemaker", "fm", "frame", "maker", "book");
export const Application_VendorFrogansFnc = new Application("vnd.frogans.fnc", "fnc");
export const Application_VendorFrogansLtf = new Application("vnd.frogans.ltf", "ltf");
export const Application_VendorFscWeblaunch = new Application("vnd.fsc.weblaunch", "fsc");
export const Application_VendorFujitsuOasys = new Application("vnd.fujitsu.oasys", "oas");
export const Application_VendorFujitsuOasys2 = new Application("vnd.fujitsu.oasys2", "oa2");
export const Application_VendorFujitsuOasys3 = new Application("vnd.fujitsu.oasys3", "oa3");
export const Application_VendorFujitsuOasysgp = new Application("vnd.fujitsu.oasysgp", "fg5");
export const Application_VendorFujitsuOasysprs = new Application("vnd.fujitsu.oasysprs", "bh2");
export const Application_VendorFujixeroxART_EX = new Application("vnd.fujixerox.art-ex");
export const Application_VendorFujixeroxART4 = new Application("vnd.fujixerox.art4");
export const Application_VendorFujixeroxDdd = new Application("vnd.fujixerox.ddd", "ddd");
export const Application_VendorFujixeroxDocuworks = new Application("vnd.fujixerox.docuworks", "xdw");
export const Application_VendorFujixeroxDocuworksBinder = new Application("vnd.fujixerox.docuworks.binder", "xbd");
export const Application_VendorFujixeroxDocuworksContainer = new Application("vnd.fujixerox.docuworks.container");
export const Application_VendorFujixeroxHBPL = new Application("vnd.fujixerox.hbpl");
export const Application_VendorFut_Misnet = new Application("vnd.fut-misnet");
export const Application_VendorFutoinCbor = new Application("vnd.futoin+cbor", "cbor");
export const Application_VendorFutoinJson = new Application("vnd.futoin+json", "json");
export const Application_VendorFuzzysheet = new Application("vnd.fuzzysheet", "fzs");
export const Application_VendorGenomatixTuxedo = new Application("vnd.genomatix.tuxedo", "txd");
export const Application_VendorGenticsGrdJson = new Application("vnd.gentics.grd+json", "json");

//[System.Obsolete("OBSOLETED by request")];
export const Application_VendorGeocubeXml = new Application("vnd.geocube+xml", "xml");

export const Application_VendorGeogebraFile = new Application("vnd.geogebra.file", "ggb");
export const Application_VendorGeogebraTool = new Application("vnd.geogebra.tool", "ggt");

//[System.Obsolete("(OBSOLETED by  in favor of application/geo+json)")];
export const Application_VendorGeoJson = new Application("vnd.geo+json", "json");

export const Application_VendorGeometry_Explorer = new Application("vnd.geometry-explorer", "gex", "gre");
export const Application_VendorGeonext = new Application("vnd.geonext", "gxt");
export const Application_VendorGeoplan = new Application("vnd.geoplan", "g2w");
export const Application_VendorGeospace = new Application("vnd.geospace", "g3w");
export const Application_VendorGerber = new Application("vnd.gerber");
export const Application_VendorGlobalplatformCard_Content_Mgt = new Application("vnd.globalplatform.card-content-mgt");
export const Application_VendorGlobalplatformCard_Content_Mgt_Response = new Application("vnd.globalplatform.card-content-mgt-response");

//[System.Obsolete("DEPRECATED")];
export const Application_VendorGmx = new Application("vnd.gmx", "gmx");

export const Application_VendorGoogle_EarthKmlXml = new Application("vnd.google-earth.kml+xml", "kml");
export const Application_VendorGoogle_EarthKmz = new Application("vnd.google-earth.kmz", "kmz");
export const Application_VendorGovSkE_FormXml = new Application("vnd.gov.sk.e-form+xml", "xml");
export const Application_VendorGovSkE_FormZip = new Application("vnd.gov.sk.e-form+zip", "zip");
export const Application_VendorGovSkXmldatacontainerXml = new Application("vnd.gov.sk.xmldatacontainer+xml", "xml");
export const Application_VendorGrafeq = new Application("vnd.grafeq", "gqf", "gqs");
export const Application_VendorGridmp = new Application("vnd.gridmp");
export const Application_VendorGroove_Account = new Application("vnd.groove-account", "gac");
export const Application_VendorGroove_Help = new Application("vnd.groove-help", "ghf");
export const Application_VendorGroove_Identity_Message = new Application("vnd.groove-identity-message", "gim");
export const Application_VendorGroove_Injector = new Application("vnd.groove-injector", "grv");
export const Application_VendorGroove_Tool_Message = new Application("vnd.groove-tool-message", "gtm");
export const Application_VendorGroove_Tool_Template = new Application("vnd.groove-tool-template", "tpl");
export const Application_VendorGroove_Vcard = new Application("vnd.groove-vcard", "vcg");
export const Application_VendorHalJson = new Application("vnd.hal+json", "json");
export const Application_VendorHalXml = new Application("vnd.hal+xml", "hal");
export const Application_VendorHandHeld_EntertainmentXml = new Application("vnd.handheld-entertainment+xml", "zmm");
export const Application_VendorHbci = new Application("vnd.hbci", "hbci");
export const Application_VendorHcJson = new Application("vnd.hc+json", "json");
export const Application_VendorHcl_Bireports = new Application("vnd.hcl-bireports");
export const Application_VendorHdt = new Application("vnd.hdt");
export const Application_VendorHerokuJson = new Application("vnd.heroku+json", "json");
export const Application_VendorHheLesson_Player = new Application("vnd.hhe.lesson-player", "les");
export const Application_VendorHp_HPGL = new Application("vnd.hp-hpgl", "hpgl");
export const Application_VendorHp_Hpid = new Application("vnd.hp-hpid", "hpid");
export const Application_VendorHp_Hps = new Application("vnd.hp-hps", "hps");
export const Application_VendorHp_Jlyt = new Application("vnd.hp-jlyt", "jlt");
export const Application_VendorHp_PCL = new Application("vnd.hp-pcl", "pcl");
export const Application_VendorHp_PCLXL = new Application("vnd.hp-pclxl", "pclxl");
export const Application_VendorHttphone = new Application("vnd.httphone");
export const Application_VendorHydrostatixSof_Data = new Application("vnd.hydrostatix.sof-data", "sfd-hdstx");
export const Application_VendorHyper_ItemJson = new Application("vnd.hyper-item+json", "json");
export const Application_VendorHyperdriveJson = new Application("vnd.hyperdrive+json", "json");
export const Application_VendorHyperJson = new Application("vnd.hyper+json", "json");
export const Application_VendorHzn_3d_Crossword = new Application("vnd.hzn-3d-crossword");

//[System.Obsolete("OBSOLETED in favor of vnd.afpc.afplinedata")];
export const Application_VendorIbmAfplinedata = new Application("vnd.ibm.afplinedata");

export const Application_VendorIbmElectronic_Media = new Application("vnd.ibm.electronic-media");
export const Application_VendorIbmMiniPay = new Application("vnd.ibm.minipay", "mpy");

//[System.Obsolete("OBSOLETED in favor of application/vnd.afpc.modca")];
export const Application_VendorIbmModcap = new Application("vnd.ibm.modcap", "afp", "listafp", "list3820");

export const Application_VendorIbmRights_Management = new Application("vnd.ibm.rights-management", "irm");
export const Application_VendorIbmSecure_Container = new Application("vnd.ibm.secure-container", "sc");
export const Application_VendorIccprofile = new Application("vnd.iccprofile", "icc", "icm");
export const Application_VendorIeee1905 = new Application("vnd.ieee.1905");
export const Application_VendorIgloader = new Application("vnd.igloader", "igl");
export const Application_VendorImagemeterFolderZip = new Application("vnd.imagemeter.folder+zip", "zip");
export const Application_VendorImagemeterImageZip = new Application("vnd.imagemeter.image+zip", "zip");
export const Application_VendorImmervision_Ivp = new Application("vnd.immervision-ivp", "ivp");
export const Application_VendorImmervision_Ivu = new Application("vnd.immervision-ivu", "ivu");
export const Application_VendorImsImsccv1p1 = new Application("vnd.ims.imsccv1p1");
export const Application_VendorImsImsccv1p2 = new Application("vnd.ims.imsccv1p2");
export const Application_VendorImsImsccv1p3 = new Application("vnd.ims.imsccv1p3");
export const Application_VendorImsLisV2ResultJson = new Application("vnd.ims.lis.v2.result+json", "json");
export const Application_VendorImsLtiV2ToolconsumerprofileJson = new Application("vnd.ims.lti.v2.toolconsumerprofile+json", "json");
export const Application_VendorImsLtiV2ToolproxyIdJson = new Application("vnd.ims.lti.v2.toolproxy.id+json", "json");
export const Application_VendorImsLtiV2ToolproxyJson = new Application("vnd.ims.lti.v2.toolproxy+json", "json");
export const Application_VendorImsLtiV2ToolsettingsJson = new Application("vnd.ims.lti.v2.toolsettings+json", "json");
export const Application_VendorImsLtiV2ToolsettingsSimpleJson = new Application("vnd.ims.lti.v2.toolsettings.simple+json", "json");
export const Application_VendorInformedcontrolRmsXml = new Application("vnd.informedcontrol.rms+xml", "xml");

//[System.Obsolete("OBSOLETED in favor of application/vnd.visionary")];
export const Application_VendorInformix_Visionary = new Application("vnd.informix-visionary");

export const Application_VendorInfotechProject = new Application("vnd.infotech.project");
export const Application_VendorInfotechProjectXml = new Application("vnd.infotech.project+xml", "xml");
export const Application_VendorInnopathWampNotification = new Application("vnd.innopath.wamp.notification");
export const Application_VendorInsorsIgm = new Application("vnd.insors.igm", "igm");
export const Application_VendorInterconFormnet = new Application("vnd.intercon.formnet", "xpw", "xpx");
export const Application_VendorIntergeo = new Application("vnd.intergeo", "i2g");
export const Application_VendorIntertrustDigibox = new Application("vnd.intertrust.digibox");
export const Application_VendorIntertrustNncp = new Application("vnd.intertrust.nncp");
export const Application_VendorIntuQbo = new Application("vnd.intu.qbo", "qbo");
export const Application_VendorIntuQfx = new Application("vnd.intu.qfx", "qfx");
export const Application_VendorIptcG2CatalogitemXml = new Application("vnd.iptc.g2.catalogitem+xml", "xml");
export const Application_VendorIptcG2ConceptitemXml = new Application("vnd.iptc.g2.conceptitem+xml", "xml");
export const Application_VendorIptcG2KnowledgeitemXml = new Application("vnd.iptc.g2.knowledgeitem+xml", "xml");
export const Application_VendorIptcG2NewsitemXml = new Application("vnd.iptc.g2.newsitem+xml", "xml");
export const Application_VendorIptcG2NewsmessageXml = new Application("vnd.iptc.g2.newsmessage+xml", "xml");
export const Application_VendorIptcG2PackageitemXml = new Application("vnd.iptc.g2.packageitem+xml", "xml");
export const Application_VendorIptcG2PlanningitemXml = new Application("vnd.iptc.g2.planningitem+xml", "xml");
export const Application_VendorIpunpluggedRcprofile = new Application("vnd.ipunplugged.rcprofile", "rcprofile");
export const Application_VendorIrepositoryPackageXml = new Application("vnd.irepository.package+xml", "irp");
export const Application_VendorIs_Xpr = new Application("vnd.is-xpr", "xpr");
export const Application_VendorIsacFcs = new Application("vnd.isac.fcs", "fcs");
export const Application_VendorIso11783_10Zip = new Application("vnd.iso11783-10+zip", "zip");
export const Application_VendorJam = new Application("vnd.jam", "jam");
export const Application_VendorJapannet_Directory_Service = new Application("vnd.japannet-directory-service");
export const Application_VendorJapannet_Jpnstore_Wakeup = new Application("vnd.japannet-jpnstore-wakeup");
export const Application_VendorJapannet_Payment_Wakeup = new Application("vnd.japannet-payment-wakeup");
export const Application_VendorJapannet_Registration = new Application("vnd.japannet-registration");
export const Application_VendorJapannet_Registration_Wakeup = new Application("vnd.japannet-registration-wakeup");
export const Application_VendorJapannet_Setstore_Wakeup = new Application("vnd.japannet-setstore-wakeup");
export const Application_VendorJapannet_Verification = new Application("vnd.japannet-verification");
export const Application_VendorJapannet_Verification_Wakeup = new Application("vnd.japannet-verification-wakeup");
export const Application_VendorJcpJavameMidlet_Rms = new Application("vnd.jcp.javame.midlet-rms", "rms");
export const Application_VendorJisp = new Application("vnd.jisp", "jisp");
export const Application_VendorJoostJoda_Archive = new Application("vnd.joost.joda-archive", "joda");
export const Application_VendorJskIsdn_Ngn = new Application("vnd.jsk.isdn-ngn");
export const Application_VendorKahootz = new Application("vnd.kahootz", "ktz", "ktr");
export const Application_VendorKdeKarbon = new Application("vnd.kde.karbon", "karbon");
export const Application_VendorKdeKchart = new Application("vnd.kde.kchart", "chrt");
export const Application_VendorKdeKformula = new Application("vnd.kde.kformula", "kfo");
export const Application_VendorKdeKivio = new Application("vnd.kde.kivio", "flw");
export const Application_VendorKdeKontour = new Application("vnd.kde.kontour", "kon");
export const Application_VendorKdeKpresenter = new Application("vnd.kde.kpresenter", "kpr", "kpt");
export const Application_VendorKdeKspread = new Application("vnd.kde.kspread", "ksp");
export const Application_VendorKdeKword = new Application("vnd.kde.kword", "kwd", "kwt");
export const Application_VendorKenameaapp = new Application("vnd.kenameaapp", "htke");
export const Application_VendorKidspiration = new Application("vnd.kidspiration", "kia");
export const Application_VendorKinar = new Application("vnd.kinar", "kne", "knp");
export const Application_VendorKoan = new Application("vnd.koan", "skp", "skd", "skt", "skm");
export const Application_VendorKodak_Descriptor = new Application("vnd.kodak-descriptor", "sse");
export const Application_VendorLas = new Application("vnd.las");
export const Application_VendorLasLasJson = new Application("vnd.las.las+json", "json");
export const Application_VendorLasLasXml = new Application("vnd.las.las+xml", "lasxml");
export const Application_VendorLaszip = new Application("vnd.laszip");
export const Application_VendorLeapJson = new Application("vnd.leap+json", "json");
export const Application_VendorLiberty_RequestXml = new Application("vnd.liberty-request+xml", "xml");
export const Application_VendorLlamagraphicsLife_BalanceDesktop = new Application("vnd.llamagraphics.life-balance.desktop", "lbd");
export const Application_VendorLlamagraphicsLife_BalanceExchangeXml = new Application("vnd.llamagraphics.life-balance.exchange+xml", "lbe");
export const Application_VendorLogipipeCircuitZip = new Application("vnd.logipipe.circuit+zip", "zip");
export const Application_VendorLoom = new Application("vnd.loom");
export const Application_VendorLotus_1_2_3 = new Application("vnd.lotus-1-2-3", "123");
export const Application_VendorLotus_Approach = new Application("vnd.lotus-approach", "apr");
export const Application_VendorLotus_Freelance = new Application("vnd.lotus-freelance", "pre");
export const Application_VendorLotus_Notes = new Application("vnd.lotus-notes", "nsf");
export const Application_VendorLotus_Organizer = new Application("vnd.lotus-organizer", "org");
export const Application_VendorLotus_Screencam = new Application("vnd.lotus-screencam", "scm");
export const Application_VendorLotus_Wordpro = new Application("vnd.lotus-wordpro", "lwp");
export const Application_VendorMacportsPortpkg = new Application("vnd.macports.portpkg", "portpkg");
export const Application_VendorMapbox_Vector_Tile = new Application("vnd.mapbox-vector-tile");
export const Application_VendorMarlinDrmActiontokenXml = new Application("vnd.marlin.drm.actiontoken+xml", "xml");
export const Application_VendorMarlinDrmConftokenXml = new Application("vnd.marlin.drm.conftoken+xml", "xml");
export const Application_VendorMarlinDrmLicenseXml = new Application("vnd.marlin.drm.license+xml", "xml");
export const Application_VendorMarlinDrmMdcf = new Application("vnd.marlin.drm.mdcf");
export const Application_VendorMasonJson = new Application("vnd.mason+json", "json");
export const Application_VendorMaxmindMaxmind_Db = new Application("vnd.maxmind.maxmind-db");
export const Application_VendorMcd = new Application("vnd.mcd", "mcd");
export const Application_VendorMedcalcdata = new Application("vnd.medcalcdata", "mc1");
export const Application_VendorMediastationCdkey = new Application("vnd.mediastation.cdkey", "cdkey");
export const Application_VendorMeridian_Slingshot = new Application("vnd.meridian-slingshot");
export const Application_VendorMFER = new Application("vnd.mfer", "mwf");
export const Application_VendorMfmp = new Application("vnd.mfmp", "mfm");
export const Application_VendorMicrografxFlo = new Application("vnd.micrografx.flo", "flo");
export const Application_VendorMicrografxIgx = new Application("vnd.micrografx.igx", "igx");
export const Application_VendorMicroJson = new Application("vnd.micro+json", "json");
export const Application_VendorMicrosoftPortable_Executable = new Application("vnd.microsoft.portable-executable");
export const Application_VendorMicrosoftWindowsThumbnail_Cache = new Application("vnd.microsoft.windows.thumbnail-cache");
export const Application_VendorMieleJson = new Application("vnd.miele+json", "json");
export const Application_VendorMif = new Application("vnd.mif", "mif");
export const Application_VendorMinisoft_Hp3000_Save = new Application("vnd.minisoft-hp3000-save");
export const Application_VendorMitsubishiMisty_GuardTrustweb = new Application("vnd.mitsubishi.misty-guard.trustweb");
export const Application_VendorMobiusDAF = new Application("vnd.mobius.daf", "daf");
export const Application_VendorMobiusDIS = new Application("vnd.mobius.dis", "dis");
export const Application_VendorMobiusMBK = new Application("vnd.mobius.mbk", "mbk");
export const Application_VendorMobiusMQY = new Application("vnd.mobius.mqy", "mqy");
export const Application_VendorMobiusMSL = new Application("vnd.mobius.msl", "msl");
export const Application_VendorMobiusPLC = new Application("vnd.mobius.plc", "plc");
export const Application_VendorMobiusTXF = new Application("vnd.mobius.txf", "txf");
export const Application_VendorMophunApplication = new Application("vnd.mophun.application", "mpn");
export const Application_VendorMophunCertificate = new Application("vnd.mophun.certificate", "mpc");
export const Application_VendorMotorolaFlexsuite = new Application("vnd.motorola.flexsuite");
export const Application_VendorMotorolaFlexsuiteAdsi = new Application("vnd.motorola.flexsuite.adsi");
export const Application_VendorMotorolaFlexsuiteFis = new Application("vnd.motorola.flexsuite.fis");
export const Application_VendorMotorolaFlexsuiteGotap = new Application("vnd.motorola.flexsuite.gotap");
export const Application_VendorMotorolaFlexsuiteKmr = new Application("vnd.motorola.flexsuite.kmr");
export const Application_VendorMotorolaFlexsuiteTtc = new Application("vnd.motorola.flexsuite.ttc");
export const Application_VendorMotorolaFlexsuiteWem = new Application("vnd.motorola.flexsuite.wem");
export const Application_VendorMotorolaIprm = new Application("vnd.motorola.iprm");
export const Application_VendorMozillaXulXml = new Application("vnd.mozilla.xul+xml", "xul");
export const Application_VendorMs_3mfdocument = new Application("vnd.ms-3mfdocument");
export const Application_VendorMs_Artgalry = new Application("vnd.ms-artgalry", "cil");
export const Application_VendorMs_Asf = new Application("vnd.ms-asf");
export const Application_VendorMs_Cab_Compressed = new Application("vnd.ms-cab-compressed", "cab");
export const Application_VendorMs_ColorIccprofile = new Application("vnd.ms-color.iccprofile");
export const Application_VendorMs_Excel = new Application("vnd.ms-excel", "xls", "xlm", "xla", "xlc", "xlt", "xlw");
export const Application_VendorMs_ExcelAddinMacroEnabled12 = new Application("vnd.ms-excel.addin.macroenabled.12", "xlam");
export const Application_VendorMs_ExcelSheetBinaryMacroEnabled12 = new Application("vnd.ms-excel.sheet.binary.macroenabled.12", "xlsb");
export const Application_VendorMs_ExcelSheetMacroEnabled12 = new Application("vnd.ms-excel.sheet.macroenabled.12", "xlsm");
export const Application_VendorMs_ExcelTemplateMacroEnabled12 = new Application("vnd.ms-excel.template.macroenabled.12", "xltm");
export const Application_VendorMs_Fontobject = new Application("vnd.ms-fontobject", "eot");
export const Application_VendorMs_Htmlhelp = new Application("vnd.ms-htmlhelp", "chm");
export const Application_VendorMs_Ims = new Application("vnd.ms-ims", "ims");
export const Application_VendorMs_Lrm = new Application("vnd.ms-lrm", "lrm");
export const Application_VendorMs_OfficeActiveXXml = new Application("vnd.ms-office.activex+xml", "xml");
export const Application_VendorMs_Officetheme = new Application("vnd.ms-officetheme", "thmx");
export const Application_VendorMs_Opentype = new Application("vnd.ms-opentype");
export const Application_VendorMs_PackageObfuscated_Opentype = new Application("vnd.ms-package.obfuscated-opentype");
export const Application_VendorMs_PkiSeccat = new Application("vnd.ms-pki.seccat", "cat");
export const Application_VendorMs_PkiStl = new Application("vnd.ms-pki.stl", "stl");
export const Application_VendorMs_PlayreadyInitiatorXml = new Application("vnd.ms-playready.initiator+xml", "xml");
export const Application_VendorMs_Powerpoint = new Application("vnd.ms-powerpoint", "ppt", "pps", "pot");
export const Application_VendorMs_PowerpointAddinMacroEnabled12 = new Application("vnd.ms-powerpoint.addin.macroenabled.12", "ppam");
export const Application_VendorMs_PowerpointPresentationMacroEnabled12 = new Application("vnd.ms-powerpoint.presentation.macroenabled.12", "pptm");
export const Application_VendorMs_PowerpointSlideMacroEnabled12 = new Application("vnd.ms-powerpoint.slide.macroenabled.12", "sldm");
export const Application_VendorMs_PowerpointSlideshowMacroEnabled12 = new Application("vnd.ms-powerpoint.slideshow.macroenabled.12", "ppsm");
export const Application_VendorMs_PowerpointTemplateMacroEnabled12 = new Application("vnd.ms-powerpoint.template.macroenabled.12", "potm");
export const Application_VendorMs_PrintDeviceCapabilitiesXml = new Application("vnd.ms-printdevicecapabilities+xml", "xml");
export const Application_VendorMs_PrintingPrintticketXml = new Application("vnd.ms-printing.printticket+xml", "xml");
export const Application_VendorMs_PrintSchemaTicketXml = new Application("vnd.ms-printschematicket+xml", "xml");
export const Application_VendorMs_Project = new Application("vnd.ms-project", "mpp", "mpt");
export const Application_VendorMs_Tnef = new Application("vnd.ms-tnef");
export const Application_VendorMs_WindowsDevicepairing = new Application("vnd.ms-windows.devicepairing");
export const Application_VendorMs_WindowsNwprintingOob = new Application("vnd.ms-windows.nwprinting.oob");
export const Application_VendorMs_WindowsPrinterpairing = new Application("vnd.ms-windows.printerpairing");
export const Application_VendorMs_WindowsWsdOob = new Application("vnd.ms-windows.wsd.oob");
export const Application_VendorMs_WmdrmLic_Chlg_Req = new Application("vnd.ms-wmdrm.lic-chlg-req");
export const Application_VendorMs_WmdrmLic_Resp = new Application("vnd.ms-wmdrm.lic-resp");
export const Application_VendorMs_WmdrmMeter_Chlg_Req = new Application("vnd.ms-wmdrm.meter-chlg-req");
export const Application_VendorMs_WmdrmMeter_Resp = new Application("vnd.ms-wmdrm.meter-resp");
export const Application_VendorMs_WordDocumentMacroEnabled12 = new Application("vnd.ms-word.document.macroenabled.12", "docm");
export const Application_VendorMs_WordTemplateMacroEnabled12 = new Application("vnd.ms-word.template.macroenabled.12", "dotm");
export const Application_VendorMs_Works = new Application("vnd.ms-works", "wps", "wks", "wcm", "wdb");
export const Application_VendorMs_Wpl = new Application("vnd.ms-wpl", "wpl");
export const Application_VendorMs_Xpsdocument = new Application("vnd.ms-xpsdocument", "xps");
export const Application_VendorMsa_Disk_Image = new Application("vnd.msa-disk-image");
export const Application_VendorMseq = new Application("vnd.mseq", "mseq");
export const Application_VendorMsign = new Application("vnd.msign");
export const Application_VendorMultiadCreator = new Application("vnd.multiad.creator");
export const Application_VendorMultiadCreatorCif = new Application("vnd.multiad.creator.cif");
export const Application_VendorMusic_Niff = new Application("vnd.music-niff");
export const Application_VendorMusician = new Application("vnd.musician", "mus");
export const Application_VendorMuveeStyle = new Application("vnd.muvee.style", "msty");
export const Application_VendorMynfc = new Application("vnd.mynfc", "taglet");
export const Application_VendorNcdControl = new Application("vnd.ncd.control");
export const Application_VendorNcdReference = new Application("vnd.ncd.reference");
export const Application_VendorNearstInvJson = new Application("vnd.nearst.inv+json", "json");
export const Application_VendorNervana = new Application("vnd.nervana");
export const Application_VendorNetfpx = new Application("vnd.netfpx");
export const Application_VendorNeurolanguageNlu = new Application("vnd.neurolanguage.nlu", "nlu");
export const Application_VendorNimn = new Application("vnd.nimn");
export const Application_VendorNintendoNitroRom = new Application("vnd.nintendo.nitro.rom");
export const Application_VendorNintendoSnesRom = new Application("vnd.nintendo.snes.rom");
export const Application_VendorNitf = new Application("vnd.nitf", "ntf", "nitf");
export const Application_VendorNoblenet_Directory = new Application("vnd.noblenet-directory", "nnd");
export const Application_VendorNoblenet_Sealer = new Application("vnd.noblenet-sealer", "nns");
export const Application_VendorNoblenet_Web = new Application("vnd.noblenet-web", "nnw");
export const Application_VendorNokiaCatalogs = new Application("vnd.nokia.catalogs");
export const Application_VendorNokiaConmlWbxml = new Application("vnd.nokia.conml+wbxml", "wbxml");
export const Application_VendorNokiaConmlXml = new Application("vnd.nokia.conml+xml", "xml");
export const Application_VendorNokiaIptvConfigXml = new Application("vnd.nokia.iptv.config+xml", "xml");
export const Application_VendorNokiaISDS_Radio_Presets = new Application("vnd.nokia.isds-radio-presets");
export const Application_VendorNokiaLandmarkcollectionXml = new Application("vnd.nokia.landmarkcollection+xml", "xml");
export const Application_VendorNokiaLandmarkWbxml = new Application("vnd.nokia.landmark+wbxml", "wbxml");
export const Application_VendorNokiaLandmarkXml = new Application("vnd.nokia.landmark+xml", "xml");
export const Application_VendorNokiaN_GageAcXml = new Application("vnd.nokia.n-gage.ac+xml", "xml");
export const Application_VendorNokiaN_GageData = new Application("vnd.nokia.n-gage.data", "ngdat");

//[System.Obsolete("OBSOLETE; no replacement given")];
export const Application_VendorNokiaN_GageSymbianInstall = new Application("vnd.nokia.n-gage.symbian.install", "n-gage");

export const Application_VendorNokiaNcd = new Application("vnd.nokia.ncd");
export const Application_VendorNokiaPcdWbxml = new Application("vnd.nokia.pcd+wbxml", "wbxml");
export const Application_VendorNokiaPcdXml = new Application("vnd.nokia.pcd+xml", "xml");
export const Application_VendorNokiaRadio_Preset = new Application("vnd.nokia.radio-preset", "rpst");
export const Application_VendorNokiaRadio_Presets = new Application("vnd.nokia.radio-presets", "rpss");
export const Application_VendorNovadigmEDM = new Application("vnd.novadigm.edm", "edm");
export const Application_VendorNovadigmEDX = new Application("vnd.novadigm.edx", "edx");
export const Application_VendorNovadigmEXT = new Application("vnd.novadigm.ext", "ext");
export const Application_VendorNtt_LocalContent_Share = new Application("vnd.ntt-local.content-share");
export const Application_VendorNtt_LocalFile_Transfer = new Application("vnd.ntt-local.file-transfer");
export const Application_VendorNtt_LocalOgw_remote_Access = new Application("vnd.ntt-local.ogw_remote-access");
export const Application_VendorNtt_LocalSip_Ta_remote = new Application("vnd.ntt-local.sip-ta_remote");
export const Application_VendorNtt_LocalSip_Ta_tcp_stream = new Application("vnd.ntt-local.sip-ta_tcp_stream");
export const Application_VendorOasisOpendocumentChart = new Application("vnd.oasis.opendocument.chart", "odc");
export const Application_VendorOasisOpendocumentChart_Template = new Application("vnd.oasis.opendocument.chart-template", "otc");
export const Application_VendorOasisOpendocumentDatabase = new Application("vnd.oasis.opendocument.database", "odb");
export const Application_VendorOasisOpendocumentFormula = new Application("vnd.oasis.opendocument.formula", "odf");
export const Application_VendorOasisOpendocumentFormula_Template = new Application("vnd.oasis.opendocument.formula-template", "odft");
export const Application_VendorOasisOpendocumentGraphics = new Application("vnd.oasis.opendocument.graphics", "odg");
export const Application_VendorOasisOpendocumentGraphics_Template = new Application("vnd.oasis.opendocument.graphics-template", "otg");
export const Application_VendorOasisOpendocumentImage = new Application("vnd.oasis.opendocument.image", "odi");
export const Application_VendorOasisOpendocumentImage_Template = new Application("vnd.oasis.opendocument.image-template", "oti");
export const Application_VendorOasisOpendocumentPresentation = new Application("vnd.oasis.opendocument.presentation", "odp");
export const Application_VendorOasisOpendocumentPresentation_Template = new Application("vnd.oasis.opendocument.presentation-template", "otp");
export const Application_VendorOasisOpendocumentSpreadsheet = new Application("vnd.oasis.opendocument.spreadsheet", "ods");
export const Application_VendorOasisOpendocumentSpreadsheet_Template = new Application("vnd.oasis.opendocument.spreadsheet-template", "ots");
export const Application_VendorOasisOpendocumentText = new Application("vnd.oasis.opendocument.text", "odt");
export const Application_VendorOasisOpendocumentText_Master = new Application("vnd.oasis.opendocument.text-master", "odm");
export const Application_VendorOasisOpendocumentText_Template = new Application("vnd.oasis.opendocument.text-template", "ott");
export const Application_VendorOasisOpendocumentText_Web = new Application("vnd.oasis.opendocument.text-web", "oth");
export const Application_VendorObn = new Application("vnd.obn");
export const Application_VendorOcfCbor = new Application("vnd.ocf+cbor", "cbor");
export const Application_VendorOftnL10nJson = new Application("vnd.oftn.l10n+json", "json");
export const Application_VendorOipfContentaccessdownloadXml = new Application("vnd.oipf.contentaccessdownload+xml", "xml");
export const Application_VendorOipfContentaccessstreamingXml = new Application("vnd.oipf.contentaccessstreaming+xml", "xml");
export const Application_VendorOipfCspg_Hexbinary = new Application("vnd.oipf.cspg-hexbinary");
export const Application_VendorOipfDaeSvgXml = new Application("vnd.oipf.dae.svg+xml", "xml");
export const Application_VendorOipfDaeXhtmlXml = new Application("vnd.oipf.dae.xhtml+xml", "xml");
export const Application_VendorOipfMippvcontrolmessageXml = new Application("vnd.oipf.mippvcontrolmessage+xml", "xml");
export const Application_VendorOipfPaeGem = new Application("vnd.oipf.pae.gem");
export const Application_VendorOipfSpdiscoveryXml = new Application("vnd.oipf.spdiscovery+xml", "xml");
export const Application_VendorOipfSpdlistXml = new Application("vnd.oipf.spdlist+xml", "xml");
export const Application_VendorOipfUeprofileXml = new Application("vnd.oipf.ueprofile+xml", "xml");
export const Application_VendorOipfUserprofileXml = new Application("vnd.oipf.userprofile+xml", "xml");
export const Application_VendorOlpc_Sugar = new Application("vnd.olpc-sugar", "xo");
export const Application_VendorOma_Scws_Config = new Application("vnd.oma-scws-config");
export const Application_VendorOma_Scws_Http_Request = new Application("vnd.oma-scws-http-request");
export const Application_VendorOma_Scws_Http_Response = new Application("vnd.oma-scws-http-response");
export const Application_VendorOmaBcastAssociated_Procedure_ParameterXml = new Application("vnd.oma.bcast.associated-procedure-parameter+xml", "xml");
export const Application_VendorOmaBcastDrm_TriggerXml = new Application("vnd.oma.bcast.drm-trigger+xml", "xml");
export const Application_VendorOmaBcastImdXml = new Application("vnd.oma.bcast.imd+xml", "xml");
export const Application_VendorOmaBcastLtkm = new Application("vnd.oma.bcast.ltkm");
export const Application_VendorOmaBcastNotificationXml = new Application("vnd.oma.bcast.notification+xml", "xml");
export const Application_VendorOmaBcastProvisioningtrigger = new Application("vnd.oma.bcast.provisioningtrigger");
export const Application_VendorOmaBcastSgboot = new Application("vnd.oma.bcast.sgboot");
export const Application_VendorOmaBcastSgddXml = new Application("vnd.oma.bcast.sgdd+xml", "xml");
export const Application_VendorOmaBcastSgdu = new Application("vnd.oma.bcast.sgdu");
export const Application_VendorOmaBcastSimple_Symbol_Container = new Application("vnd.oma.bcast.simple-symbol-container");
export const Application_VendorOmaBcastSmartcard_TriggerXml = new Application("vnd.oma.bcast.smartcard-trigger+xml", "xml");
export const Application_VendorOmaBcastSprovXml = new Application("vnd.oma.bcast.sprov+xml", "xml");
export const Application_VendorOmaBcastStkm = new Application("vnd.oma.bcast.stkm");
export const Application_VendorOmaCab_Address_BookXml = new Application("vnd.oma.cab-address-book+xml", "xml");
export const Application_VendorOmaCab_Feature_HandlerXml = new Application("vnd.oma.cab-feature-handler+xml", "xml");
export const Application_VendorOmaCab_PccXml = new Application("vnd.oma.cab-pcc+xml", "xml");
export const Application_VendorOmaCab_Subs_InviteXml = new Application("vnd.oma.cab-subs-invite+xml", "xml");
export const Application_VendorOmaCab_User_PrefsXml = new Application("vnd.oma.cab-user-prefs+xml", "xml");
export const Application_VendorOmaDcd = new Application("vnd.oma.dcd");
export const Application_VendorOmaDcdc = new Application("vnd.oma.dcdc");
export const Application_VendorOmaDd2Xml = new Application("vnd.oma.dd2+xml", "dd2");
export const Application_VendorOmaDrmRisdXml = new Application("vnd.oma.drm.risd+xml", "xml");
export const Application_VendorOmads_EmailXml = new Application("vnd.omads-email+xml", "xml");
export const Application_VendorOmads_FileXml = new Application("vnd.omads-file+xml", "xml");
export const Application_VendorOmads_FolderXml = new Application("vnd.omads-folder+xml", "xml");
export const Application_VendorOmaGroup_Usage_ListXml = new Application("vnd.oma.group-usage-list+xml", "xml");
export const Application_VendorOmaloc_Supl_Init = new Application("vnd.omaloc-supl-init");
export const Application_VendorOmaLwm2mJson = new Application("vnd.oma.lwm2m+json", "json");
export const Application_VendorOmaLwm2mTlv = new Application("vnd.oma.lwm2m+tlv", "tlv");
export const Application_VendorOmaPalXml = new Application("vnd.oma.pal+xml", "xml");
export const Application_VendorOmaPocDetailed_Progress_ReportXml = new Application("vnd.oma.poc.detailed-progress-report+xml", "xml");
export const Application_VendorOmaPocFinal_ReportXml = new Application("vnd.oma.poc.final-report+xml", "xml");
export const Application_VendorOmaPocGroupsXml = new Application("vnd.oma.poc.groups+xml", "xml");
export const Application_VendorOmaPocInvocation_DescriptorXml = new Application("vnd.oma.poc.invocation-descriptor+xml", "xml");
export const Application_VendorOmaPocOptimized_Progress_ReportXml = new Application("vnd.oma.poc.optimized-progress-report+xml", "xml");
export const Application_VendorOmaPush = new Application("vnd.oma.push");
export const Application_VendorOmaScidmMessagesXml = new Application("vnd.oma.scidm.messages+xml", "xml");
export const Application_VendorOmaXcap_DirectoryXml = new Application("vnd.oma.xcap-directory+xml", "xml");
export const Application_VendorOnepager = new Application("vnd.onepager");
export const Application_VendorOnepagertamp = new Application("vnd.onepagertamp");
export const Application_VendorOnepagertamx = new Application("vnd.onepagertamx");
export const Application_VendorOnepagertat = new Application("vnd.onepagertat");
export const Application_VendorOnepagertatp = new Application("vnd.onepagertatp");
export const Application_VendorOnepagertatx = new Application("vnd.onepagertatx");
export const Application_VendorOpenbloxGame_Binary = new Application("vnd.openblox.game-binary");
export const Application_VendorOpenbloxGameXml = new Application("vnd.openblox.game+xml", "xml");
export const Application_VendorOpeneyeOeb = new Application("vnd.openeye.oeb");
export const Application_VendorOpenofficeorgExtension = new Application("vnd.openofficeorg.extension", "oxt");
export const Application_VendorOpenstreetmapDataXml = new Application("vnd.openstreetmap.data+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentCustom_PropertiesXml = new Application("vnd.openxmlformats-officedocument.custom-properties+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentCustomXmlPropertiesXml = new Application("vnd.openxmlformats-officedocument.customxmlproperties+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentDrawingmlChartshapesXml = new Application("vnd.openxmlformats-officedocument.drawingml.chartshapes+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentDrawingmlChartXml = new Application("vnd.openxmlformats-officedocument.drawingml.chart+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentDrawingmlDiagramColorsXml = new Application("vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentDrawingmlDiagramDataXml = new Application("vnd.openxmlformats-officedocument.drawingml.diagramdata+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentDrawingmlDiagramLayoutXml = new Application("vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentDrawingmlDiagramStyleXml = new Application("vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentDrawingXml = new Application("vnd.openxmlformats-officedocument.drawing+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentExtended_PropertiesXml = new Application("vnd.openxmlformats-officedocument.extended-properties+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentPresentationmlCommentAuthorsXml = new Application("vnd.openxmlformats-officedocument.presentationml.commentauthors+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentPresentationmlCommentsXml = new Application("vnd.openxmlformats-officedocument.presentationml.comments+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentPresentationmlHandoutMasterXml = new Application("vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentPresentationmlNotesMasterXml = new Application("vnd.openxmlformats-officedocument.presentationml.notesmaster+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentPresentationmlNotesSlideXml = new Application("vnd.openxmlformats-officedocument.presentationml.notesslide+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentPresentationmlPresentation = new Application("vnd.openxmlformats-officedocument.presentationml.presentation", "pptx");
export const Application_VendorOpenxmlformats_OfficedocumentPresentationmlPresentationMainXml = new Application("vnd.openxmlformats-officedocument.presentationml.presentation.main+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentPresentationmlPresPropsXml = new Application("vnd.openxmlformats-officedocument.presentationml.presprops+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentPresentationmlSlide = new Application("vnd.openxmlformats-officedocument.presentationml.slide", "sldx");
export const Application_VendorOpenxmlformats_OfficedocumentPresentationmlSlideLayoutXml = new Application("vnd.openxmlformats-officedocument.presentationml.slidelayout+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentPresentationmlSlideMasterXml = new Application("vnd.openxmlformats-officedocument.presentationml.slidemaster+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentPresentationmlSlideshow = new Application("vnd.openxmlformats-officedocument.presentationml.slideshow", "ppsx");
export const Application_VendorOpenxmlformats_OfficedocumentPresentationmlSlideshowMainXml = new Application("vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentPresentationmlSlideUpdateInfoXml = new Application("vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentPresentationmlSlideXml = new Application("vnd.openxmlformats-officedocument.presentationml.slide+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentPresentationmlTableStylesXml = new Application("vnd.openxmlformats-officedocument.presentationml.tablestyles+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentPresentationmlTagsXml = new Application("vnd.openxmlformats-officedocument.presentationml.tags+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentPresentationmlTemplate = new Application("vnd.openxmlformats-officedocument.presentationml.template", "potx");
export const Application_VendorOpenxmlformats_OfficedocumentPresentationmlTemplateMainXml = new Application("vnd.openxmlformats-officedocument.presentationml.template.main+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentPresentationmlViewPropsXml = new Application("vnd.openxmlformats-officedocument.presentationml.viewprops+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentSpreadsheetmlCalcChainXml = new Application("vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentSpreadsheetmlChartsheetXml = new Application("vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentSpreadsheetmlCommentsXml = new Application("vnd.openxmlformats-officedocument.spreadsheetml.comments+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentSpreadsheetmlConnectionsXml = new Application("vnd.openxmlformats-officedocument.spreadsheetml.connections+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentSpreadsheetmlDialogsheetXml = new Application("vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentSpreadsheetmlExternalLinkXml = new Application("vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentSpreadsheetmlPivotCacheDefinitionXml = new Application("vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentSpreadsheetmlPivotCacheRecordsXml = new Application("vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentSpreadsheetmlPivotTableXml = new Application("vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentSpreadsheetmlQueryTableXml = new Application("vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentSpreadsheetmlRevisionHeadersXml = new Application("vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentSpreadsheetmlRevisionLogXml = new Application("vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentSpreadsheetmlSharedStringsXml = new Application("vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentSpreadsheetmlSheet = new Application("vnd.openxmlformats-officedocument.spreadsheetml.sheet", "xlsx");
export const Application_VendorOpenxmlformats_OfficedocumentSpreadsheetmlSheetMainXml = new Application("vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentSpreadsheetmlSheetMetadataXml = new Application("vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentSpreadsheetmlStylesXml = new Application("vnd.openxmlformats-officedocument.spreadsheetml.styles+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentSpreadsheetmlTableSingleCellsXml = new Application("vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentSpreadsheetmlTableXml = new Application("vnd.openxmlformats-officedocument.spreadsheetml.table+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentSpreadsheetmlTemplate = new Application("vnd.openxmlformats-officedocument.spreadsheetml.template", "xltx");
export const Application_VendorOpenxmlformats_OfficedocumentSpreadsheetmlTemplateMainXml = new Application("vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentSpreadsheetmlUserNamesXml = new Application("vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentSpreadsheetmlVolatileDependenciesXml = new Application("vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentSpreadsheetmlWorksheetXml = new Application("vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentThemeOverrideXml = new Application("vnd.openxmlformats-officedocument.themeoverride+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentThemeXml = new Application("vnd.openxmlformats-officedocument.theme+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentVmlDrawing = new Application("vnd.openxmlformats-officedocument.vmldrawing");
export const Application_VendorOpenxmlformats_OfficedocumentWordprocessingmlCommentsXml = new Application("vnd.openxmlformats-officedocument.wordprocessingml.comments+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentWordprocessingmlDocument = new Application("vnd.openxmlformats-officedocument.wordprocessingml.document", "docx");
export const Application_VendorOpenxmlformats_OfficedocumentWordprocessingmlDocumentGlossaryXml = new Application("vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentWordprocessingmlDocumentMainXml = new Application("vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentWordprocessingmlEndnotesXml = new Application("vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentWordprocessingmlFontTableXml = new Application("vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentWordprocessingmlFooterXml = new Application("vnd.openxmlformats-officedocument.wordprocessingml.footer+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentWordprocessingmlFootnotesXml = new Application("vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentWordprocessingmlNumberingXml = new Application("vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentWordprocessingmlSettingsXml = new Application("vnd.openxmlformats-officedocument.wordprocessingml.settings+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentWordprocessingmlStylesXml = new Application("vnd.openxmlformats-officedocument.wordprocessingml.styles+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentWordprocessingmlTemplate = new Application("vnd.openxmlformats-officedocument.wordprocessingml.template", "dotx");
export const Application_VendorOpenxmlformats_OfficedocumentWordprocessingmlTemplateMainXml = new Application("vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml", "xml");
export const Application_VendorOpenxmlformats_OfficedocumentWordprocessingmlWebSettingsXml = new Application("vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml", "xml");
export const Application_VendorOpenxmlformats_PackageCore_PropertiesXml = new Application("vnd.openxmlformats-package.core-properties+xml", "xml");
export const Application_VendorOpenxmlformats_PackageDigital_Signature_XmlsignatureXml = new Application("vnd.openxmlformats-package.digital-signature-xmlsignature+xml", "xml");
export const Application_VendorOpenxmlformats_PackageRelationshipsXml = new Application("vnd.openxmlformats-package.relationships+xml", "xml");
export const Application_VendorOracleResourceJson = new Application("vnd.oracle.resource+json", "json");
export const Application_VendorOrangeIndata = new Application("vnd.orange.indata");
export const Application_VendorOsaNetdeploy = new Application("vnd.osa.netdeploy");
export const Application_VendorOsgeoMapguidePackage = new Application("vnd.osgeo.mapguide.package", "mgp");
export const Application_VendorOsgiBundle = new Application("vnd.osgi.bundle");
export const Application_VendorOsgiDp = new Application("vnd.osgi.dp", "dp");
export const Application_VendorOsgiSubsystem = new Application("vnd.osgi.subsystem", "esa");
export const Application_VendorOtpsCt_KipXml = new Application("vnd.otps.ct-kip+xml", "xml");
export const Application_VendorOxliCountgraph = new Application("vnd.oxli.countgraph");
export const Application_VendorPagerdutyJson = new Application("vnd.pagerduty+json", "json");
export const Application_VendorPalm = new Application("vnd.palm", "pdb", "pqa", "oprc");
export const Application_VendorPanoply = new Application("vnd.panoply");
export const Application_VendorPaosXml = new Application("vnd.paos.xml");
export const Application_VendorPatentdive = new Application("vnd.patentdive");
export const Application_VendorPatientecommsdoc = new Application("vnd.patientecommsdoc");
export const Application_VendorPawaafile = new Application("vnd.pawaafile", "paw");
export const Application_VendorPcos = new Application("vnd.pcos");
export const Application_VendorPgFormat = new Application("vnd.pg.format", "str");
export const Application_VendorPgOsasli = new Application("vnd.pg.osasli", "ei6");
export const Application_VendorPiaccessApplication_Licence = new Application("vnd.piaccess.application-licence");
export const Application_VendorPicsel = new Application("vnd.picsel", "efif");
export const Application_VendorPmiWidget = new Application("vnd.pmi.widget", "wg");
export const Application_VendorPocGroup_AdvertisementXml = new Application("vnd.poc.group-advertisement+xml", "xml");
export const Application_VendorPocketlearn = new Application("vnd.pocketlearn", "plf");
export const Application_VendorPowerbuilder6 = new Application("vnd.powerbuilder6", "pbd");
export const Application_VendorPowerbuilder6_S = new Application("vnd.powerbuilder6-s");
export const Application_VendorPowerbuilder7 = new Application("vnd.powerbuilder7");
export const Application_VendorPowerbuilder7_S = new Application("vnd.powerbuilder7-s");
export const Application_VendorPowerbuilder75 = new Application("vnd.powerbuilder75");
export const Application_VendorPowerbuilder75_S = new Application("vnd.powerbuilder75-s");
export const Application_VendorPreminet = new Application("vnd.preminet");
export const Application_VendorPreviewsystemsBox = new Application("vnd.previewsystems.box", "box");
export const Application_VendorProteusMagazine = new Application("vnd.proteus.magazine", "mgz");
export const Application_VendorPsfs = new Application("vnd.psfs");
export const Application_VendorPublishare_Delta_Tree = new Application("vnd.publishare-delta-tree", "qps");
export const Application_VendorPviPtid1 = new Application("vnd.pvi.ptid1", "ptid");
export const Application_VendorPwg_Multiplexed = new Application("vnd.pwg-multiplexed");
export const Application_VendorPwg_Xhtml_PrintXml = new Application("vnd.pwg-xhtml-print+xml", "xml");
export const Application_VendorQualcommBrew_App_Res = new Application("vnd.qualcomm.brew-app-res");
export const Application_VendorQuarantainenet = new Application("vnd.quarantainenet");
export const Application_VendorQuarkQuarkXPress = new Application("vnd.quark.quarkxpress", "qxd", "qxt", "qwd", "qwt", "qxl", "qxb");
export const Application_VendorQuobject_Quoxdocument = new Application("vnd.quobject-quoxdocument");
export const Application_VendorRadisysMomlXml = new Application("vnd.radisys.moml+xml", "xml");
export const Application_VendorRadisysMsml_Audit_ConfXml = new Application("vnd.radisys.msml-audit-conf+xml", "xml");
export const Application_VendorRadisysMsml_Audit_ConnXml = new Application("vnd.radisys.msml-audit-conn+xml", "xml");
export const Application_VendorRadisysMsml_Audit_DialogXml = new Application("vnd.radisys.msml-audit-dialog+xml", "xml");
export const Application_VendorRadisysMsml_Audit_StreamXml = new Application("vnd.radisys.msml-audit-stream+xml", "xml");
export const Application_VendorRadisysMsml_AuditXml = new Application("vnd.radisys.msml-audit+xml", "xml");
export const Application_VendorRadisysMsml_ConfXml = new Application("vnd.radisys.msml-conf+xml", "xml");
export const Application_VendorRadisysMsml_Dialog_BaseXml = new Application("vnd.radisys.msml-dialog-base+xml", "xml");
export const Application_VendorRadisysMsml_Dialog_Fax_DetectXml = new Application("vnd.radisys.msml-dialog-fax-detect+xml", "xml");
export const Application_VendorRadisysMsml_Dialog_Fax_SendrecvXml = new Application("vnd.radisys.msml-dialog-fax-sendrecv+xml", "xml");
export const Application_VendorRadisysMsml_Dialog_GroupXml = new Application("vnd.radisys.msml-dialog-group+xml", "xml");
export const Application_VendorRadisysMsml_Dialog_SpeechXml = new Application("vnd.radisys.msml-dialog-speech+xml", "xml");
export const Application_VendorRadisysMsml_Dialog_TransformXml = new Application("vnd.radisys.msml-dialog-transform+xml", "xml");
export const Application_VendorRadisysMsml_DialogXml = new Application("vnd.radisys.msml-dialog+xml", "xml");
export const Application_VendorRadisysMsmlXml = new Application("vnd.radisys.msml+xml", "xml");
export const Application_VendorRainstorData = new Application("vnd.rainstor.data");
export const Application_VendorRapid = new Application("vnd.rapid");
export const Application_VendorRar = new Application("vnd.rar");
export const Application_VendorRealvncBed = new Application("vnd.realvnc.bed", "bed");
export const Application_VendorRecordareMusicxml = new Application("vnd.recordare.musicxml", "mxl");
export const Application_VendorRecordareMusicxmlXml = new Application("vnd.recordare.musicxml+xml", "musicxml");
export const Application_VendorRenLearnRlprint = new Application("vnd.renlearn.rlprint");
export const Application_VendorRestfulJson = new Application("vnd.restful+json", "json");
export const Application_VendorRigCryptonote = new Application("vnd.rig.cryptonote", "cryptonote");
export const Application_VendorRimCod = new Application("vnd.rim.cod", "cod");
export const Application_VendorRn_Realmedia = new Application("vnd.rn-realmedia", "rm");
export const Application_VendorRn_Realmedia_Vbr = new Application("vnd.rn-realmedia-vbr", "rmvb");
export const Application_VendorRoute66Link66Xml = new Application("vnd.route66.link66+xml", "link66");
export const Application_VendorRs_274x = new Application("vnd.rs-274x");
export const Application_VendorRuckusDownload = new Application("vnd.ruckus.download");
export const Application_VendorS3sms = new Application("vnd.s3sms");
export const Application_VendorSailingtrackerTrack = new Application("vnd.sailingtracker.track", "st");
export const Application_VendorSar = new Application("vnd.sar");
export const Application_VendorSbmCid = new Application("vnd.sbm.cid");
export const Application_VendorSbmMid2 = new Application("vnd.sbm.mid2");
export const Application_VendorScribus = new Application("vnd.scribus");
export const Application_VendorSealed3df = new Application("vnd.sealed.3df");
export const Application_VendorSealedCsf = new Application("vnd.sealed.csf");
export const Application_VendorSealedDoc = new Application("vnd.sealed.doc");
export const Application_VendorSealedEml = new Application("vnd.sealed.eml");
export const Application_VendorSealedmediaSoftsealHtml = new Application("vnd.sealedmedia.softseal.html");
export const Application_VendorSealedmediaSoftsealPdf = new Application("vnd.sealedmedia.softseal.pdf");
export const Application_VendorSealedMht = new Application("vnd.sealed.mht");
export const Application_VendorSealedNet = new Application("vnd.sealed.net");
export const Application_VendorSealedPpt = new Application("vnd.sealed.ppt");
export const Application_VendorSealedTiff = new Application("vnd.sealed.tiff");
export const Application_VendorSealedXls = new Application("vnd.sealed.xls");
export const Application_VendorSeemail = new Application("vnd.seemail", "see");
export const Application_VendorSema = new Application("vnd.sema", "sema");
export const Application_VendorSemd = new Application("vnd.semd", "semd");
export const Application_VendorSemf = new Application("vnd.semf", "semf");
export const Application_VendorShade_Save_File = new Application("vnd.shade-save-file");
export const Application_VendorShanaInformedFormdata = new Application("vnd.shana.informed.formdata", "ifm");
export const Application_VendorShanaInformedFormtemplate = new Application("vnd.shana.informed.formtemplate", "itp");
export const Application_VendorShanaInformedInterchange = new Application("vnd.shana.informed.interchange", "iif");
export const Application_VendorShanaInformedPackage = new Application("vnd.shana.informed.package", "ipk");
export const Application_VendorShootproofJson = new Application("vnd.shootproof+json", "json");
export const Application_VendorShopkickJson = new Application("vnd.shopkick+json", "json");
export const Application_VendorSigrokSession = new Application("vnd.sigrok.session");
export const Application_VendorSimTech_MindMapper = new Application("vnd.simtech-mindmapper", "twd", "twds");
export const Application_VendorSirenJson = new Application("vnd.siren+json", "json");
export const Application_VendorSmaf = new Application("vnd.smaf", "mmf");
export const Application_VendorSmartNotebook = new Application("vnd.smart.notebook");
export const Application_VendorSmartTeacher = new Application("vnd.smart.teacher", "teacher");
export const Application_VendorSoftware602FillerForm_Xml_Zip = new Application("vnd.software602.filler.form-xml-zip");
export const Application_VendorSoftware602FillerFormXml = new Application("vnd.software602.filler.form+xml", "xml");
export const Application_VendorSolentSdkmXml = new Application("vnd.solent.sdkm+xml", "sdkm", "sdkd");
export const Application_VendorSpotfireDxp = new Application("vnd.spotfire.dxp", "dxp");
export const Application_VendorSpotfireSfs = new Application("vnd.spotfire.sfs", "sfs");
export const Application_VendorSqlite3 = new Application("vnd.sqlite3");
export const Application_VendorSss_Cod = new Application("vnd.sss-cod");
export const Application_VendorSss_Dtf = new Application("vnd.sss-dtf");
export const Application_VendorSss_Ntf = new Application("vnd.sss-ntf");
export const Application_VendorStardivisionCalc = new Application("vnd.stardivision.calc", "sdc");
export const Application_VendorStardivisionDraw = new Application("vnd.stardivision.draw", "sda");
export const Application_VendorStardivisionImpress = new Application("vnd.stardivision.impress", "sdd");
export const Application_VendorStardivisionMath = new Application("vnd.stardivision.math", "smf");
export const Application_VendorStardivisionWriter = new Application("vnd.stardivision.writer", "sdw", "vor");
export const Application_VendorStardivisionWriter_Global = new Application("vnd.stardivision.writer-global", "sgl");
export const Application_VendorStepmaniaPackage = new Application("vnd.stepmania.package", "smzip");
export const Application_VendorStepmaniaStepchart = new Application("vnd.stepmania.stepchart", "sm");
export const Application_VendorStreet_Stream = new Application("vnd.street-stream");
export const Application_VendorSunWadlXml = new Application("vnd.sun.wadl+xml", "xml");
export const Application_VendorSunXmlCalc = new Application("vnd.sun.xml.calc", "sxc");
export const Application_VendorSunXmlCalcTemplate = new Application("vnd.sun.xml.calc.template", "stc");
export const Application_VendorSunXmlDraw = new Application("vnd.sun.xml.draw", "sxd");
export const Application_VendorSunXmlDrawTemplate = new Application("vnd.sun.xml.draw.template", "std");
export const Application_VendorSunXmlImpress = new Application("vnd.sun.xml.impress", "sxi");
export const Application_VendorSunXmlImpressTemplate = new Application("vnd.sun.xml.impress.template", "sti");
export const Application_VendorSunXmlMath = new Application("vnd.sun.xml.math", "sxm");
export const Application_VendorSunXmlWriter = new Application("vnd.sun.xml.writer", "sxw");
export const Application_VendorSunXmlWriterGlobal = new Application("vnd.sun.xml.writer.global", "sxg");
export const Application_VendorSunXmlWriterTemplate = new Application("vnd.sun.xml.writer.template", "stw");
export const Application_VendorSus_Calendar = new Application("vnd.sus-calendar", "sus", "susp");
export const Application_VendorSvd = new Application("vnd.svd", "svd");
export const Application_VendorSwiftview_Ics = new Application("vnd.swiftview-ics");
export const Application_VendorSymbianInstall = new Application("vnd.symbian.install", "sis", "sisx");
export const Application_VendorSyncmlDmddfWbxml = new Application("vnd.syncml.dmddf+wbxml", "wbxml");
export const Application_VendorSyncmlDmddfXml = new Application("vnd.syncml.dmddf+xml", "xml");
export const Application_VendorSyncmlDmNotification = new Application("vnd.syncml.dm.notification");
export const Application_VendorSyncmlDmtndsWbxml = new Application("vnd.syncml.dmtnds+wbxml", "wbxml");
export const Application_VendorSyncmlDmtndsXml = new Application("vnd.syncml.dmtnds+xml", "xml");
export const Application_VendorSyncmlDmWbxml = new Application("vnd.syncml.dm+wbxml", "bdm");
export const Application_VendorSyncmlDmXml = new Application("vnd.syncml.dm+xml", "xdm");
export const Application_VendorSyncmlDsNotification = new Application("vnd.syncml.ds.notification");
export const Application_VendorSyncmlXml = new Application("vnd.syncml+xml", "xsm");
export const Application_VendorTableschemaJson = new Application("vnd.tableschema+json", "json");
export const Application_VendorTaoIntent_Module_Archive = new Application("vnd.tao.intent-module-archive", "tao");
export const Application_VendorTcpdumpPcap = new Application("vnd.tcpdump.pcap", "pcap", "cap", "dmp");
export const Application_VendorThink_CellPpttcJson = new Application("vnd.think-cell.ppttc+json", "json");
export const Application_VendorTmdMediaflexApiXml = new Application("vnd.tmd.mediaflex.api+xml", "xml");
export const Application_VendorTml = new Application("vnd.tml");
export const Application_VendorTmobile_Livetv = new Application("vnd.tmobile-livetv", "tmo");
export const Application_VendorTridTpt = new Application("vnd.trid.tpt", "tpt");
export const Application_VendorTriOnesource = new Application("vnd.tri.onesource");
export const Application_VendorTriscapeMxs = new Application("vnd.triscape.mxs", "mxs");
export const Application_VendorTrueapp = new Application("vnd.trueapp", "tra");
export const Application_VendorTruedoc = new Application("vnd.truedoc");
export const Application_VendorUbisoftWebplayer = new Application("vnd.ubisoft.webplayer");
export const Application_VendorUfdl = new Application("vnd.ufdl", "ufd", "ufdl");
export const Application_VendorUiqTheme = new Application("vnd.uiq.theme", "utz");
export const Application_VendorUmajin = new Application("vnd.umajin", "umj");
export const Application_VendorUnity = new Application("vnd.unity", "unityweb");
export const Application_VendorUomlXml = new Application("vnd.uoml+xml", "uoml");
export const Application_VendorUplanetAlert = new Application("vnd.uplanet.alert");
export const Application_VendorUplanetAlert_Wbxml = new Application("vnd.uplanet.alert-wbxml");
export const Application_VendorUplanetBearer_Choice = new Application("vnd.uplanet.bearer-choice");
export const Application_VendorUplanetBearer_Choice_Wbxml = new Application("vnd.uplanet.bearer-choice-wbxml");
export const Application_VendorUplanetCacheop = new Application("vnd.uplanet.cacheop");
export const Application_VendorUplanetCacheop_Wbxml = new Application("vnd.uplanet.cacheop-wbxml");
export const Application_VendorUplanetChannel = new Application("vnd.uplanet.channel");
export const Application_VendorUplanetChannel_Wbxml = new Application("vnd.uplanet.channel-wbxml");
export const Application_VendorUplanetList = new Application("vnd.uplanet.list");
export const Application_VendorUplanetList_Wbxml = new Application("vnd.uplanet.list-wbxml");
export const Application_VendorUplanetListcmd = new Application("vnd.uplanet.listcmd");
export const Application_VendorUplanetListcmd_Wbxml = new Application("vnd.uplanet.listcmd-wbxml");
export const Application_VendorUplanetSignal = new Application("vnd.uplanet.signal");
export const Application_VendorUri_Map = new Application("vnd.uri-map");
export const Application_VendorValveSourceMaterial = new Application("vnd.valve.source.material");
export const Application_VendorVcx = new Application("vnd.vcx", "vcx");
export const Application_VendorVd_Study = new Application("vnd.vd-study");
export const Application_VendorVectorworks = new Application("vnd.vectorworks");
export const Application_VendorVelJson = new Application("vnd.vel+json", "json");
export const Application_VendorVerimatrixVcas = new Application("vnd.verimatrix.vcas");
export const Application_VendorVeryantThin = new Application("vnd.veryant.thin");
export const Application_VendorVesEncrypted = new Application("vnd.ves.encrypted");
export const Application_VendorVidsoftVidconference = new Application("vnd.vidsoft.vidconference");
export const Application_VendorVisio = new Application("vnd.visio", "vsd", "vst", "vss", "vsw");
export const Application_VendorVisionary = new Application("vnd.visionary", "vis");
export const Application_VendorVividenceScriptfile = new Application("vnd.vividence.scriptfile");
export const Application_VendorVsf = new Application("vnd.vsf", "vsf");
export const Application_VendorWapSic = new Application("vnd.wap.sic");
export const Application_VendorWapSlc = new Application("vnd.wap.slc");
export const Application_VendorWapWbxml = new Application("vnd.wap.wbxml", "wbxml");
export const Application_VendorWapWmlc = new Application("vnd.wap.wmlc", "wmlc");
export const Application_VendorWapWmlscriptc = new Application("vnd.wap.wmlscriptc", "wmlsc");
export const Application_VendorWebturbo = new Application("vnd.webturbo", "wtb");
export const Application_VendorWfaP2p = new Application("vnd.wfa.p2p");
export const Application_VendorWfaWsc = new Application("vnd.wfa.wsc");
export const Application_VendorWindowsDevicepairing = new Application("vnd.windows.devicepairing");
export const Application_VendorWmc = new Application("vnd.wmc");
export const Application_VendorWmfBootstrap = new Application("vnd.wmf.bootstrap");
export const Application_VendorWolframMathematica = new Application("vnd.wolfram.mathematica");
export const Application_VendorWolframMathematicaPackage = new Application("vnd.wolfram.mathematica.package");
export const Application_VendorWolframPlayer = new Application("vnd.wolfram.player", "nbp");
export const Application_VendorWordperfect = new Application("vnd.wordperfect", "wpd");
export const Application_VendorWqd = new Application("vnd.wqd", "wqd");
export const Application_VendorWrq_Hp3000_Labelled = new Application("vnd.wrq-hp3000-labelled");
export const Application_VendorWtStf = new Application("vnd.wt.stf", "stf");
export const Application_VendorWvCspWbxml = new Application("vnd.wv.csp+wbxml", "wbxml");
export const Application_VendorWvCspXml = new Application("vnd.wv.csp+xml", "xml");
export const Application_VendorWvSspXml = new Application("vnd.wv.ssp+xml", "xml");
export const Application_VendorXacmlJson = new Application("vnd.xacml+json", "json");
export const Application_VendorXara = new Application("vnd.xara", "xar");
export const Application_VendorXfdl = new Application("vnd.xfdl", "xfdl");
export const Application_VendorXfdlWebform = new Application("vnd.xfdl.webform");
export const Application_VendorXmiXml = new Application("vnd.xmi+xml", "xml");
export const Application_VendorXmpieCpkg = new Application("vnd.xmpie.cpkg");
export const Application_VendorXmpieDpkg = new Application("vnd.xmpie.dpkg");
export const Application_VendorXmpiePlan = new Application("vnd.xmpie.plan");
export const Application_VendorXmpiePpkg = new Application("vnd.xmpie.ppkg");
export const Application_VendorXmpieXlim = new Application("vnd.xmpie.xlim");
export const Application_VendorYamahaHv_Dic = new Application("vnd.yamaha.hv-dic", "hvd");
export const Application_VendorYamahaHv_Script = new Application("vnd.yamaha.hv-script", "hvs");
export const Application_VendorYamahaHv_Voice = new Application("vnd.yamaha.hv-voice", "hvp");
export const Application_VendorYamahaOpenscoreformat = new Application("vnd.yamaha.openscoreformat", "osf");
export const Application_VendorYamahaOpenscoreformatOsfpvgXml = new Application("vnd.yamaha.openscoreformat.osfpvg+xml", "osfpvg");
export const Application_VendorYamahaRemote_Setup = new Application("vnd.yamaha.remote-setup");
export const Application_VendorYamahaSmaf_Audio = new Application("vnd.yamaha.smaf-audio", "saf");
export const Application_VendorYamahaSmaf_Phrase = new Application("vnd.yamaha.smaf-phrase", "spf");
export const Application_VendorYamahaThrough_Ngn = new Application("vnd.yamaha.through-ngn");
export const Application_VendorYamahaTunnel_Udpencap = new Application("vnd.yamaha.tunnel-udpencap");
export const Application_VendorYaoweme = new Application("vnd.yaoweme");
export const Application_VendorYellowriver_Custom_Menu = new Application("vnd.yellowriver-custom-menu", "cmp");

//[System.Obsolete("OBSOLETED in favor of video/vnd.youtube.yt")];
export const Application_VendorYoutubeYt = new Application("vnd.youtube.yt");

export const Application_VendorZul = new Application("vnd.zul", "zir", "zirz");
export const Application_VendorZzazzDeckXml = new Application("vnd.zzazz.deck+xml", "zaz");
export const Application_VividenceScriptfile = new Application("vividence.scriptfile");
export const Application_VoicexmlXml = new Application("voicexml+xml", "vxml");
export const Application_Voucher_CmsJson = new Application("voucher-cms+json", "json");
export const Application_Vq_Rtcpxr = new Application("vq-rtcpxr");
export const Application_WatcherinfoXml = new Application("watcherinfo+xml", "xml");
export const Application_Webpush_OptionsJson = new Application("webpush-options+json", "json");
export const Application_Whoispp_Query = new Application("whoispp-query");
export const Application_Whoispp_Response = new Application("whoispp-response");
export const Application_Widget = new Application("widget", "wgt");
export const Application_Winhlp = new Application("winhlp", "hlp");
export const Application_Wita = new Application("wita");
export const Application_Wordperfect51 = new Application("wordperfect5.1");
export const Application_WsdlXml = new Application("wsdl+xml", "wsdl");
export const Application_WspolicyXml = new Application("wspolicy+xml", "wspolicy");
export const Application_X_7z_Compressed = new Application("x-7z-compressed", "7z");
export const Application_X_Abiword = new Application("x-abiword", "abw");
export const Application_X_Ace_Compressed = new Application("x-ace-compressed", "ace");
export const Application_X_Amf = new Application("x-amf");
export const Application_X_Apple_Diskimage = new Application("x-apple-diskimage", "dmg");
export const Application_X_Authorware_Bin = new Application("x-authorware-bin", "aab", "x32", "u32", "vox");
export const Application_X_Authorware_Map = new Application("x-authorware-map", "aam");
export const Application_X_Authorware_Seg = new Application("x-authorware-seg", "aas");
export const Application_X_Bcpio = new Application("x-bcpio", "bcpio");
export const Application_X_Bittorrent = new Application("x-bittorrent", "torrent");
export const Application_X_Blorb = new Application("x-blorb", "blb", "blorb");
export const Application_X_Bzip = new Application("x-bzip", "bz");
export const Application_X_Bzip2 = new Application("x-bzip2", "bz2", "boz");
export const Application_X_Cbr = new Application("x-cbr", "cbr", "cba", "cbt", "cbz", "cb7");
export const Application_X_Cdlink = new Application("x-cdlink", "vcd");
export const Application_X_Cfs_Compressed = new Application("x-cfs-compressed", "cfs");
export const Application_X_Chat = new Application("x-chat", "chat");
export const Application_X_Chess_Pgn = new Application("x-chess-pgn", "pgn");
export const Application_X_Compress = new Application("x-compress");
export const Application_X_Conference = new Application("x-conference", "nsc");
export const Application_X_Cpio = new Application("x-cpio", "cpio");
export const Application_X_Csh = new Application("x-csh", "csh");
export const Application_X_Debian_Package = new Application("x-debian-package", "deb", "udeb");
export const Application_X_Dgc_Compressed = new Application("x-dgc-compressed", "dgc");
export const Application_X_Director = new Application("x-director", "dir", "dcr", "dxr", "cst", "cct", "cxt", "w3d", "fgd", "swa");
export const Application_X_Doom = new Application("x-doom", "wad");
export const Application_X_DtbncxXml = new Application("x-dtbncx+xml", "ncx");
export const Application_X_DtbookXml = new Application("x-dtbook+xml", "dtb");
export const Application_X_DtbresourceXml = new Application("x-dtbresource+xml", "res");
export const Application_X_Dvi = new Application("x-dvi", "dvi");
export const Application_X_Envoy = new Application("x-envoy", "evy");
export const Application_X_Eva = new Application("x-eva", "eva");
export const Application_X_Font_Bdf = new Application("x-font-bdf", "bdf");
export const Application_X_Font_Dos = new Application("x-font-dos");
export const Application_X_Font_Framemaker = new Application("x-font-framemaker");
export const Application_X_Font_Ghostscript = new Application("x-font-ghostscript", "gsf");
export const Application_X_Font_Libgrx = new Application("x-font-libgrx");
export const Application_X_Font_Linux_Psf = new Application("x-font-linux-psf", "psf");
export const Application_X_Font_Pcf = new Application("x-font-pcf", "pcf");
export const Application_X_Font_Snf = new Application("x-font-snf", "snf");
export const Application_X_Font_Speedo = new Application("x-font-speedo");
export const Application_X_Font_Sunos_News = new Application("x-font-sunos-news");
export const Application_X_Font_Type1 = new Application("x-font-type1", "pfa", "pfb", "pfm", "afm");
export const Application_X_Font_Vfont = new Application("x-font-vfont");
export const Application_X_Freearc = new Application("x-freearc", "arc");
export const Application_X_Futuresplash = new Application("x-futuresplash", "spl");
export const Application_X_Gca_Compressed = new Application("x-gca-compressed", "gca");
export const Application_X_Glulx = new Application("x-glulx", "ulx");
export const Application_X_Gnumeric = new Application("x-gnumeric", "gnumeric");
export const Application_X_Gramps_Xml = new Application("x-gramps-xml", "gramps");
export const Application_X_Gtar = new Application("x-gtar", "gtar");
export const Application_X_Gzip = new Application("x-gzip");
export const Application_X_Hdf = new Application("x-hdf", "hdf");
export const Application_X_Install_Instructions = new Application("x-install-instructions", "install");
export const Application_X_Iso9660_Image = new Application("x-iso9660-image", "iso");
export const Application_X_Java_Jnlp_File = new Application("x-java-jnlp-file", "jnlp");
export const Application_X_Latex = new Application("x-latex", "latex");
export const Application_X_Lzh_Compressed = new Application("x-lzh-compressed", "lzh", "lha");
export const Application_X_Mie = new Application("x-mie", "mie");
export const Application_X_Mobipocket_Ebook = new Application("x-mobipocket-ebook", "prc", "mobi");
export const Application_X_Ms_Application = new Application("x-ms-application", "application");
export const Application_X_Ms_Shortcut = new Application("x-ms-shortcut", "lnk");
export const Application_X_Ms_Wmd = new Application("x-ms-wmd", "wmd");
export const Application_X_Ms_Wmz = new Application("x-ms-wmz", "wmz");
export const Application_X_Ms_Xbap = new Application("x-ms-xbap", "xbap");
export const Application_X_Msaccess = new Application("x-msaccess", "mdb");
export const Application_X_Msbinder = new Application("x-msbinder", "obd");
export const Application_X_Mscardfile = new Application("x-mscardfile", "crd");
export const Application_X_Msclip = new Application("x-msclip", "clp");
export const Application_X_Msdownload = new Application("x-msdownload", "exe", "dll", "com", "bat", "msi");
export const Application_X_Msmediaview = new Application("x-msmediaview", "mvb", "m13", "m14");
export const Application_X_Msmetafile = new Application("x-msmetafile", "wmf", "wmz", "emf", "emz");
export const Application_X_Msmoney = new Application("x-msmoney", "mny");
export const Application_X_Mspublisher = new Application("x-mspublisher", "pub");
export const Application_X_Msschedule = new Application("x-msschedule", "scd");
export const Application_X_Msterminal = new Application("x-msterminal", "trm");
export const Application_X_Mswrite = new Application("x-mswrite", "wri");
export const Application_X_Netcdf = new Application("x-netcdf", "nc", "cdf");
export const Application_X_Nzb = new Application("x-nzb", "nzb");
export const Application_X_Pkcs12 = new Application("x-pkcs12", "p12", "pfx");
export const Application_X_Pkcs7_Certificates = new Application("x-pkcs7-certificates", "p7b", "spc");
export const Application_X_Pkcs7_Certreqresp = new Application("x-pkcs7-certreqresp", "p7r");
export const Application_X_Rar_Compressed = new Application("x-rar-compressed", "rar");
export const Application_X_Research_Info_Systems = new Application("x-research-info-systems", "ris");
export const Application_X_Sh = new Application("x-sh", "sh");
export const Application_X_Shar = new Application("x-shar", "shar");
export const Application_X_Shockwave_Flash = new Application("x-shockwave-flash", "swf");
export const Application_X_Silverlight_App = new Application("x-silverlight-app", "xap");
export const Application_X_Sql = new Application("x-sql", "sql");
export const Application_X_Stuffit = new Application("x-stuffit", "sit");
export const Application_X_Stuffitx = new Application("x-stuffitx", "sitx");
export const Application_X_Subrip = new Application("x-subrip", "srt");
export const Application_X_Sv4cpio = new Application("x-sv4cpio", "sv4cpio");
export const Application_X_Sv4crc = new Application("x-sv4crc", "sv4crc");
export const Application_X_T3vm_Image = new Application("x-t3vm-image", "t3");
export const Application_X_Tads = new Application("x-tads", "gam");
export const Application_X_Tar = new Application("x-tar", "tar");
export const Application_X_Tcl = new Application("x-tcl", "tcl");
export const Application_X_Tex = new Application("x-tex", "tex");
export const Application_X_Tex_Tfm = new Application("x-tex-tfm", "tfm");
export const Application_X_Texinfo = new Application("x-texinfo", "texinfo", "texi");
export const Application_X_Tgif = new Application("x-tgif", "obj");
export const Application_X_Ustar = new Application("x-ustar", "ustar");
export const Application_X_Wais_Source = new Application("x-wais-source", "src");
export const Application_X_Www_Form_Urlencoded = new Application("x-www-form-urlencoded");
export const Application_X_X509_Ca_Cert = new Application("x-x509-ca-cert", "der", "crt");
export const Application_X_Xfig = new Application("x-xfig", "fig");
export const Application_X_XliffXml = new Application("x-xliff+xml", "xlf");
export const Application_X_Xpinstall = new Application("x-xpinstall", "xpi");
export const Application_X_Xz = new Application("x-xz", "xz");
export const Application_X_Zmachine = new Application("x-zmachine", "z1", "z2", "z3", "z4", "z5", "z6", "z7", "z8");
export const Application_X400_Bp = new Application("x400-bp");
export const Application_XacmlXml = new Application("xacml+xml", "xml");
export const Application_XamlXml = new Application("xaml+xml", "xaml");
export const Application_Xcap_AttXml = new Application("xcap-att+xml", "xml");
export const Application_Xcap_CapsXml = new Application("xcap-caps+xml", "xml");
export const Application_Xcap_DiffXml = new Application("xcap-diff+xml", "xdf");
export const Application_Xcap_ElXml = new Application("xcap-el+xml", "xml");
export const Application_Xcap_ErrorXml = new Application("xcap-error+xml", "xml");
export const Application_Xcap_NsXml = new Application("xcap-ns+xml", "xml");
export const Application_Xcon_Conference_Info_DiffXml = new Application("xcon-conference-info-diff+xml", "xml");
export const Application_Xcon_Conference_InfoXml = new Application("xcon-conference-info+xml", "xml");
export const Application_XencXml = new Application("xenc+xml", "xenc");
export const Application_Xhtml_VoiceXml = new Application("xhtml-voice+xml", "xml");
export const Application_XhtmlXml = new Application("xhtml+xml", "xhtml", "xht");
export const Application_XliffXml = new Application("xliff+xml", "xml");
export const Application_Xml = new Application("xml", "xml", "xsl");
export const Application_Xml_Dtd = new Application("xml-dtd", "dtd");
export const Application_Xml_External_Parsed_Entity = new Application("xml-external-parsed-entity");
export const Application_Xml_PatchXml = new Application("xml-patch+xml", "xml");
export const Application_XmppXml = new Application("xmpp+xml", "xml");
export const Application_XopXml = new Application("xop+xml", "xop");
export const Application_XprocXml = new Application("xproc+xml", "xpl");
export const Application_XsltXml = new Application("xslt+xml", "xslt");
export const Application_XspfXml = new Application("xspf+xml", "xspf");
export const Application_XvXml = new Application("xv+xml", "mxml", "xhvml", "xvml", "xvm");
export const Application_Yang = new Application("yang", "yang");
export const Application_Yang_DataJson = new Application("yang-data+json", "json");
export const Application_Yang_DataXml = new Application("yang-data+xml", "xml");
export const Application_Yang_PatchJson = new Application("yang-patch+json", "json");
export const Application_Yang_PatchXml = new Application("yang-patch+xml", "xml");
export const Application_YinXml = new Application("yin+xml", "yin");
export const Application_Zip = new Application("zip", "zip");
export const Application_Zlib = new Application("zlib");
export const Application_Zstd = new Application("zstd");

export const anyAudio = new Audio("*");
export const Audio_Aac = new Audio("aac", "aac");
export const Audio_Ac3 = new Audio("ac3", "ac3");
export const Audio_Adpcm = new Audio("adpcm", "adp");
export const Audio_AMR = new Audio("amr", "amr");
export const Audio_AMR_WB = new Audio("amr-wb");
export const Audio_Amr_WbPlus = new Audio("amr-wb+");
export const Audio_Aptx = new Audio("aptx");
export const Audio_Asc = new Audio("asc");
export const Audio_ATRAC_ADVANCED_LOSSLESS = new Audio("atrac-advanced-lossless");
export const Audio_ATRAC_X = new Audio("atrac-x");
export const Audio_ATRAC3 = new Audio("atrac3");
export const Audio_Basic = new Audio("basic", "au", "snd");
export const Audio_BV16 = new Audio("bv16");
export const Audio_BV32 = new Audio("bv32");
export const Audio_Clearmode = new Audio("clearmode");
export const Audio_CN = new Audio("cn");
export const Audio_DAT12 = new Audio("dat12");
export const Audio_Dls = new Audio("dls");
export const Audio_Dsr_Es201108 = new Audio("dsr-es201108");
export const Audio_Dsr_Es202050 = new Audio("dsr-es202050");
export const Audio_Dsr_Es202211 = new Audio("dsr-es202211");
export const Audio_Dsr_Es202212 = new Audio("dsr-es202212");
export const Audio_DV = new Audio("dv");
export const Audio_DVI4 = new Audio("dvi4");
export const Audio_Eac3 = new Audio("eac3");
export const Audio_Encaprtp = new Audio("encaprtp");
export const Audio_EVRC = new Audio("evrc");
export const Audio_EVRC_QCP = new Audio("evrc-qcp");
export const Audio_EVRC0 = new Audio("evrc0");
export const Audio_EVRC1 = new Audio("evrc1");
export const Audio_EVRCB = new Audio("evrcb");
export const Audio_EVRCB0 = new Audio("evrcb0");
export const Audio_EVRCB1 = new Audio("evrcb1");
export const Audio_EVRCNW = new Audio("evrcnw");
export const Audio_EVRCNW0 = new Audio("evrcnw0");
export const Audio_EVRCNW1 = new Audio("evrcnw1");
export const Audio_EVRCWB = new Audio("evrcwb");
export const Audio_EVRCWB0 = new Audio("evrcwb0");
export const Audio_EVRCWB1 = new Audio("evrcwb1");
export const Audio_EVS = new Audio("evs");
export const Audio_Example = new Audio("example");
export const Audio_Flexfec = new Audio("flexfec");
export const Audio_Fwdred = new Audio("fwdred");
export const Audio_G711_0 = new Audio("g711-0");
export const Audio_G719 = new Audio("g719");
export const Audio_G722 = new Audio("g722");
export const Audio_G7221 = new Audio("g7221");
export const Audio_G723 = new Audio("g723");
export const Audio_G726_16 = new Audio("g726-16");
export const Audio_G726_24 = new Audio("g726-24");
export const Audio_G726_32 = new Audio("g726-32");
export const Audio_G726_40 = new Audio("g726-40");
export const Audio_G728 = new Audio("g728");
export const Audio_G729 = new Audio("g729");
export const Audio_G7291 = new Audio("g7291");
export const Audio_G729D = new Audio("g729d");
export const Audio_G729E = new Audio("g729e");
export const Audio_GSM = new Audio("gsm", "gsm");
export const Audio_GSM_EFR = new Audio("gsm-efr");
export const Audio_GSM_HR_08 = new Audio("gsm-hr-08");
export const Audio_ILBC = new Audio("ilbc");
export const Audio_Ip_Mr_v25 = new Audio("ip-mr_v2.5");
export const Audio_Isac = new Audio("isac");
export const Audio_L16 = new Audio("l16");
export const Audio_L20 = new Audio("l20");
export const Audio_L24 = new Audio("l24");
export const Audio_L8 = new Audio("l8");
export const Audio_LPC = new Audio("lpc");
export const Audio_MELP = new Audio("melp");
export const Audio_MELP1200 = new Audio("melp1200");
export const Audio_MELP2400 = new Audio("melp2400");
export const Audio_MELP600 = new Audio("melp600");
export const Audio_Midi = new Audio("midi", "mid", "midi", "kar", "rmi");
export const Audio_Mobile_Xmf = new Audio("mobile-xmf");
export const Audio_Mp4 = new Audio("mp4", "m4a", "mp4a");
export const Audio_MP4A_LATM = new Audio("mp4a-latm");
export const Audio_MPA = new Audio("mpa");
export const Audio_Mpa_Robust = new Audio("mpa-robust");
export const Audio_Mpeg = new Audio("mpeg", "mp3", "mp2", "mp2a", "mpga", "m2a", "m3a");
export const Audio_Mpeg4_Generic = new Audio("mpeg4-generic");
export const Audio_Musepack = new Audio("musepack");
export const Audio_Ogg = new Audio("ogg", "ogg", "oga", "spx");
export const Audio_Opus = new Audio("opus");
export const Audio_Parityfec = new Audio("parityfec");
export const Audio_PCMA = new Audio("pcma");
export const Audio_PCMA_WB = new Audio("pcma-wb");
export const Audio_PCMU = new Audio("pcmu");
export const Audio_PCMU_WB = new Audio("pcmu-wb");
export const Audio_PrsSid = new Audio("prs.sid");
export const Audio_Qcelp = new Audio("qcelp");
export const Audio_Raptorfec = new Audio("raptorfec");
export const Audio_RED = new Audio("red");
export const Audio_Rtp_Enc_Aescm128 = new Audio("rtp-enc-aescm128");
export const Audio_Rtp_Midi = new Audio("rtp-midi");
export const Audio_Rtploopback = new Audio("rtploopback");
export const Audio_Rtx = new Audio("rtx");
export const Audio_S3m = new Audio("s3m", "s3m");
export const Audio_Silk = new Audio("silk", "sil");
export const Audio_SMV = new Audio("smv");
export const Audio_SMV_QCP = new Audio("smv-qcp");
export const Audio_SMV0 = new Audio("smv0");
export const Audio_Sp_Midi = new Audio("sp-midi");
export const Audio_Speex = new Audio("speex");
export const Audio_T140c = new Audio("t140c");
export const Audio_T38 = new Audio("t38");
export const Audio_Telephone_Event = new Audio("telephone-event");
export const Audio_TETRA_ACELP = new Audio("tetra_acelp");
export const Audio_TETRA_ACELP_BB = new Audio("tetra_acelp_bb");
export const Audio_Tone = new Audio("tone");
export const Audio_UEMCLIP = new Audio("uemclip");
export const Audio_Ulpfec = new Audio("ulpfec");
export const Audio_Usac = new Audio("usac");
export const Audio_VDVI = new Audio("vdvi");
export const Audio_Vendor1d_Interleaved_Parityfec = new Audio("1d-interleaved-parityfec");
export const Audio_Vendor32kadpcm = new Audio("32kadpcm");
export const Audio_Vendor3gpp = new Audio("3gpp");
export const Audio_Vendor3gpp2 = new Audio("3gpp2");
export const Audio_Vendor3gppIufp = new Audio("vnd.3gpp.iufp");
export const Audio_Vendor4SB = new Audio("vnd.4sb");
export const Audio_VendorAudiokoz = new Audio("vnd.audiokoz");
export const Audio_VendorCELP = new Audio("vnd.celp");
export const Audio_VendorCiscoNse = new Audio("vnd.cisco.nse");
export const Audio_VendorCmlesRadio_Events = new Audio("vnd.cmles.radio-events");
export const Audio_VendorCnsAnp1 = new Audio("vnd.cns.anp1");
export const Audio_VendorCnsInf1 = new Audio("vnd.cns.inf1");
export const Audio_VendorDeceAudio = new Audio("vnd.dece.audio", "uva", "uvva");
export const Audio_VendorDigital_Winds = new Audio("vnd.digital-winds", "eol");
export const Audio_VendorDlnaAdts = new Audio("vnd.dlna.adts");
export const Audio_VendorDolbyHeaac1 = new Audio("vnd.dolby.heaac.1");
export const Audio_VendorDolbyHeaac2 = new Audio("vnd.dolby.heaac.2");
export const Audio_VendorDolbyMlp = new Audio("vnd.dolby.mlp");
export const Audio_VendorDolbyMps = new Audio("vnd.dolby.mps");
export const Audio_VendorDolbyPl2 = new Audio("vnd.dolby.pl2");
export const Audio_VendorDolbyPl2x = new Audio("vnd.dolby.pl2x");
export const Audio_VendorDolbyPl2z = new Audio("vnd.dolby.pl2z");
export const Audio_VendorDolbyPulse1 = new Audio("vnd.dolby.pulse.1");
export const Audio_VendorDra = new Audio("vnd.dra", "dra");
export const Audio_VendorDts = new Audio("vnd.dts", "dts");
export const Audio_VendorDtsHd = new Audio("vnd.dts.hd", "dtshd");
export const Audio_VendorDtsUhd = new Audio("vnd.dts.uhd");
export const Audio_VendorDvbFile = new Audio("vnd.dvb.file");
export const Audio_VendorEveradPlj = new Audio("vnd.everad.plj");
export const Audio_VendorHnsAudio = new Audio("vnd.hns.audio");
export const Audio_VendorLucentVoice = new Audio("vnd.lucent.voice", "lvp");
export const Audio_VendorMs_PlayreadyMediaPya = new Audio("vnd.ms-playready.media.pya", "pya");
export const Audio_VendorNokiaMobile_Xmf = new Audio("vnd.nokia.mobile-xmf");
export const Audio_VendorNortelVbk = new Audio("vnd.nortel.vbk");
export const Audio_VendorNueraEcelp4800 = new Audio("vnd.nuera.ecelp4800", "ecelp4800");
export const Audio_VendorNueraEcelp7470 = new Audio("vnd.nuera.ecelp7470", "ecelp7470");
export const Audio_VendorNueraEcelp9600 = new Audio("vnd.nuera.ecelp9600", "ecelp9600");
export const Audio_VendorOctelSbc = new Audio("vnd.octel.sbc");
export const Audio_VendorPresonusMultitrack = new Audio("vnd.presonus.multitrack");

//[System.Obsolete("DEPRECATED in favor of audio/qcelp")];
export const Audio_VendorQcelp = new Audio("vnd.qcelp");

export const Audio_VendorRhetorex32kadpcm = new Audio("vnd.rhetorex.32kadpcm");
export const Audio_VendorRip = new Audio("vnd.rip", "rip");
export const Audio_VendorSealedmediaSoftsealMpeg = new Audio("vnd.sealedmedia.softseal.mpeg");
export const Audio_VendorVmxCvsd = new Audio("vnd.vmx.cvsd");
export const Audio_VendorWave = new Audio("vnd.wave", "wav");
export const Audio_VMR_WB = new Audio("vmr-wb");
export const Audio_Vorbis = new Audio("vorbis");
export const Audio_Vorbis_Config = new Audio("vorbis-config");
export const Audio_Wav = new Audio("wav", "wav");
export const Audio_Wave = new Audio("wave", "wav");
export const Audio_Webm = new Audio("webm", "weba");
export const Audio_X_Aac = new Audio("x-aac", "aac");
export const Audio_X_Aiff = new Audio("x-aiff", "aif", "aiff", "aifc");
export const Audio_X_Caf = new Audio("x-caf", "caf");
export const Audio_X_Flac = new Audio("x-flac", "flac");
export const Audio_X_Matroska = new Audio("x-matroska", "mka");
export const Audio_X_Mpegurl = new Audio("x-mpegurl", "m3u");
export const Audio_X_Ms_Wax = new Audio("x-ms-wax", "wax");
export const Audio_X_Ms_Wma = new Audio("x-ms-wma", "wma");
export const Audio_X_Pn_Realaudio = new Audio("x-pn-realaudio", "ram", "ra");
export const Audio_X_Pn_Realaudio_Plugin = new Audio("x-pn-realaudio-plugin", "rmp");
export const Audio_X_Tta = new Audio("x-tta");
export const Audio_X_Wav = new Audio("x-wav", "wav");
export const Audio_Xm = new Audio("xm", "xm");

export const anyChemical = new Chemical("*");
export const Chemical_X_Cdx = new Chemical("x-cdx", "cdx");
export const Chemical_X_Cif = new Chemical("x-cif", "cif");
export const Chemical_X_Cmdf = new Chemical("x-cmdf", "cmdf");
export const Chemical_X_Cml = new Chemical("x-cml", "cml");
export const Chemical_X_Csml = new Chemical("x-csml", "csml");
export const Chemical_X_Pdb = new Chemical("x-pdb");
export const Chemical_X_Xyz = new Chemical("x-xyz", "xyz");


export const anyFont = new Font("*");
export const Font_Collection = new Font("collection", "ttc");
export const Font_Otf = new Font("otf", "otf");
export const Font_Sfnt = new Font("sfnt");
export const Font_Ttf = new Font("ttf", "ttf");
export const Font_Woff = new Font("woff", "woff");
export const Font_Woff2 = new Font("woff2", "woff2");


export const anyImage = new Image("*");
export const Image_Aces = new Image("aces");
export const Image_Avci = new Image("avci");
export const Image_Avcs = new Image("avcs");
export const Image_Bmp = new Image("bmp", "bmp");
export const Image_Cgm = new Image("cgm", "cgm");
export const Image_Dicom_Rle = new Image("dicom-rle");
export const Image_Emf = new Image("emf");
export const Image_Example = new Image("example");
export const Image_EXR = new Image("x-exr", "exr");
export const Image_Fits = new Image("fits");
export const Image_G3fax = new Image("g3fax", "g3");
export const Image_Gif = new Image("gif", "gif");
export const Image_Heic = new Image("heic");
export const Image_Heic_Sequence = new Image("heic-sequence");
export const Image_Heif = new Image("heif");
export const Image_Heif_Sequence = new Image("heif-sequence");
export const Image_Hej2k = new Image("hej2k");
export const Image_Hsj2 = new Image("hsj2");
export const Image_Ief = new Image("ief", "ief");
export const Image_Jls = new Image("jls");
export const Image_Jp2 = new Image("jp2");
export const Image_Jpeg = new Image("jpeg", "jpeg", "jpg", "jpe");
export const Image_Jph = new Image("jph");
export const Image_Jphc = new Image("jphc");
export const Image_Jpm = new Image("jpm");
export const Image_Jpx = new Image("jpx");
export const Image_Jxr = new Image("jxr");
export const Image_JxrA = new Image("jxra");
export const Image_JxrS = new Image("jxrs");
export const Image_Jxs = new Image("jxs");
export const Image_Jxsc = new Image("jxsc");
export const Image_Jxsi = new Image("jxsi");
export const Image_Jxss = new Image("jxss");
export const Image_Ktx = new Image("ktx", "ktx");
export const Image_Naplps = new Image("naplps");
export const Image_Png = new Image("png", "png");
export const Image_PrsBtif = new Image("prs.btif", "btif");
export const Image_PrsPti = new Image("prs.pti");
export const Image_Pwg_Raster = new Image("pwg-raster");
export const Image_Raw = new Image("x-raw", "raw");
export const Image_Sgi = new Image("sgi", "sgi");
export const Image_SvgXml = new Image("svg+xml", "svg", "svgz");
export const Image_T38 = new Image("t38");
export const Image_Tiff = new Image("tiff", "tiff", "tif");
export const Image_Tiff_Fx = new Image("tiff-fx");
export const Image_VendorAdobePhotoshop = new Image("vnd.adobe.photoshop", "psd");
export const Image_VendorAirzipAcceleratorAzv = new Image("vnd.airzip.accelerator.azv");
export const Image_VendorCnsInf2 = new Image("vnd.cns.inf2");
export const Image_VendorDeceGraphic = new Image("vnd.dece.graphic", "uvi", "uvvi", "uvg", "uvvg");
export const Image_VendorDjvu = new Image("vnd.djvu", "djvu", "djv");
export const Image_VendorDvbSubtitle = new Image("vnd.dvb.subtitle", "sub");
export const Image_VendorDwg = new Image("vnd.dwg", "dwg");
export const Image_VendorDxf = new Image("vnd.dxf", "dxf");
export const Image_VendorFastbidsheet = new Image("vnd.fastbidsheet", "fbs");
export const Image_VendorFpx = new Image("vnd.fpx", "fpx");
export const Image_VendorFst = new Image("vnd.fst", "fst");
export const Image_VendorFujixeroxEdmics_Mmr = new Image("vnd.fujixerox.edmics-mmr", "mmr");
export const Image_VendorFujixeroxEdmics_Rlc = new Image("vnd.fujixerox.edmics-rlc", "rlc");
export const Image_VendorGlobalgraphicsPgb = new Image("vnd.globalgraphics.pgb");
export const Image_VendorMicrosoftIcon = new Image("vnd.microsoft.icon");
export const Image_VendorMix = new Image("vnd.mix");
export const Image_VendorMozillaApng = new Image("vnd.mozilla.apng");
export const Image_VendorMs_Modi = new Image("vnd.ms-modi", "mdi");
export const Image_VendorMs_Photo = new Image("vnd.ms-photo", "wdp");
export const Image_VendorNet_Fpx = new Image("vnd.net-fpx", "npx");
export const Image_VendorRadiance = new Image("vnd.radiance");
export const Image_VendorSealedmediaSoftsealGif = new Image("vnd.sealedmedia.softseal.gif");
export const Image_VendorSealedmediaSoftsealJpg = new Image("vnd.sealedmedia.softseal.jpg");
export const Image_VendorSealedPng = new Image("vnd.sealed.png");
export const Image_VendorSvf = new Image("vnd.svf");
export const Image_VendorTencentTap = new Image("vnd.tencent.tap");
export const Image_VendorValveSourceTexture = new Image("vnd.valve.source.texture");
export const Image_VendorWapWbmp = new Image("vnd.wap.wbmp", "wbmp");
export const Image_VendorXiff = new Image("vnd.xiff", "xif");
export const Image_VendorZbrushPcx = new Image("vnd.zbrush.pcx");
export const Image_Webp = new Image("webp", "webp");
export const Image_Wmf = new Image("wmf");
export const Image_X_3ds = new Image("x-3ds", "3ds");
export const Image_X_Cmu_Raster = new Image("x-cmu-raster", "ras");
export const Image_X_Cmx = new Image("x-cmx", "cmx");

//[System.Obsolete("DEPRECATED in favor of image/emf")]
export const Image_X_Emf = new Image("x-emf");

export const Image_X_Freehand = new Image("x-freehand", "fh", "fhc", "fh4", "fh5", "fh7");
export const Image_X_Icon = new Image("x-icon", "ico");
export const Image_X_Mrsid_Image = new Image("x-mrsid-image", "sid");
export const Image_X_Pcx = new Image("x-pcx", "pcx");
export const Image_X_Pict = new Image("x-pict", "pic", "pct");
export const Image_X_Portable_Anymap = new Image("x-portable-anymap", "pnm");
export const Image_X_Portable_Bitmap = new Image("x-portable-bitmap", "pbm");
export const Image_X_Portable_Graymap = new Image("x-portable-graymap", "pgm");
export const Image_X_Portable_Pixmap = new Image("x-portable-pixmap", "ppm");
export const Image_X_Rgb = new Image("x-rgb", "rgb");
export const Image_X_Tga = new Image("x-tga", "tga");

//[System.Obsolete("DEPRECATED in favor of image/wmf")]
export const Image_X_Wmf = new Image("x-wmf");

export const Image_X_Xbitmap = new Image("x-xbitmap", "xbm");
export const Image_X_Xpixmap = new Image("x-xpixmap", "xpm");
export const Image_X_Xwindowdump = new Image("x-xwindowdump", "xwd");


export const anyMessage = new Message("*");
export const Message_CPIM = new Message("cpim");
export const Message_Delivery_Status = new Message("delivery-status");
export const Message_Disposition_Notification = new Message("disposition-notification");
export const Message_Example = new Message("example");
export const Message_External_Body = new Message("external-body");
export const Message_Feedback_Report = new Message("feedback-report");
export const Message_Global = new Message("global");
export const Message_Global_Delivery_Status = new Message("global-delivery-status");
export const Message_Global_Disposition_Notification = new Message("global-disposition-notification");
export const Message_Global_Headers = new Message("global-headers");
export const Message_Http = new Message("http");
export const Message_ImdnXml = new Message("imdn+xml", "xml");

//[System.Obsolete("OBSOLETED by RFC5537")]
export const Message_News = new Message("news");

export const Message_Partial = new Message("partial");
export const Message_Rfc822 = new Message("rfc822", "eml", "mime");
export const Message_S_Http = new Message("s-http");
export const Message_Sip = new Message("sip");
export const Message_Sipfrag = new Message("sipfrag");
export const Message_Tracking_Status = new Message("tracking-status");

//[System.Obsolete("OBSOLETED by request")]
export const Message_VendorSiSimp = new Message("vnd.si.simp");

export const Message_VendorWfaWsc = new Message("vnd.wfa.wsc");


export const anyModel = new Model("*");
export const Model_Example = new Model("example");
export const Model_Gltf_Binary = new Model("gltf-binary");
export const Model_Gltf_Json = new Model("gltf+json", "json");
export const Model_Iges = new Model("iges", "igs", "iges");
export const Model_Mesh = new Model("mesh", "msh", "mesh", "silo");
export const Model_Stl = new Model("stl");
export const Model_Vendor3mf = new Model("3mf");
export const Model_VendorColladaXml = new Model("vnd.collada+xml", "dae");
export const Model_VendorDwf = new Model("vnd.dwf", "dwf");
export const Model_VendorFlatland3dml = new Model("vnd.flatland.3dml");
export const Model_VendorGdl = new Model("vnd.gdl", "gdl");
export const Model_VendorGs_Gdl = new Model("vnd.gs-gdl");
export const Model_VendorGsGdl = new Model("vnd.gs.gdl");
export const Model_VendorGtw = new Model("vnd.gtw", "gtw");
export const Model_VendorMomlXml = new Model("vnd.moml+xml", "xml");
export const Model_VendorMts = new Model("vnd.mts", "mts");
export const Model_VendorOpengex = new Model("vnd.opengex");
export const Model_VendorParasolidTransmitBinary = new Model("vnd.parasolid.transmit.binary");
export const Model_VendorParasolidTransmitText = new Model("vnd.parasolid.transmit.text");
export const Model_VendorRosetteAnnotated_Data_Model = new Model("vnd.rosette.annotated-data-model");
export const Model_VendorUsdzZip = new Model("vnd.usdz+zip", "zip");
export const Model_VendorValveSourceCompiled_Map = new Model("vnd.valve.source.compiled-map");
export const Model_VendorVtu = new Model("vnd.vtu", "vtu");
export const Model_Vrml = new Model("vrml", "wrl", "vrml");
export const Model_X3d_Vrml = new Model("x3d-vrml");
export const Model_X3dBinary = new Model("x3d+binary", "x3db", "x3dbz");
export const Model_X3dFastinfoset = new Model("x3d+fastinfoset", "fastinfoset");
export const Model_X3dVrml = new Model("x3d+vrml", "x3dv", "x3dvz");
export const Model_X3dXml = new Model("x3d+xml", "x3d", "x3dz");



export const anyMultipart = new Multipart("*");
export const MultipartAlternative = new Multipart("alternative");
export const MultipartAppledouble = new Multipart("appledouble");
export const MultipartByteranges = new Multipart("byteranges");
export const MultipartDigest = new Multipart("digest");
export const MultipartEncrypted = new Multipart("encrypted");
export const MultipartExample = new Multipart("example");
export const MultipartForm_Data = new Multipart("form-data");
export const MultipartHeader_Set = new Multipart("header-set");
export const MultipartMixed = new Multipart("mixed");
export const MultipartMultilingual = new Multipart("multilingual");
export const MultipartParallel = new Multipart("parallel");
export const MultipartRelated = new Multipart("related");
export const MultipartReport = new Multipart("report");
export const MultipartSigned = new Multipart("signed");
export const MultipartVendorBintMed_Plus = new Multipart("vnd.bint.med-plus");
export const MultipartVoice_Message = new Multipart("voice-message");
export const MultipartX_Mixed_Replace = new Multipart("x-mixed-replace");


export const anyText = new Text("*");
export const Text_Cache_Manifest = new Text("cache-manifest", "appcache");
export const Text_Calendar = new Text("calendar", "ics", "ifb");
export const Text_Css = new Text("css", "css");
export const Text_Csv = new Text("csv", "csv");
export const Text_Csv_Schema = new Text("csv-schema");

//[System.Obsolete("DEPRECATED by RFC6350")]
export const Text_Directory = new Text("directory");

export const Text_Dns = new Text("dns");

//[System.Obsolete("OBSOLETED in favor of application/ecmascript")]
export const Text_Ecmascript = new Text("ecmascript");

export const Text_Encaprtp = new Text("encaprtp");
export const Text_Enriched = new Text("enriched");
export const Text_Example = new Text("example");
export const Text_Flexfec = new Text("flexfec");
export const Text_Fwdred = new Text("fwdred");
export const Text_Grammar_Ref_List = new Text("grammar-ref-list");
export const Text_Html = new Text("html", "html", "htm");

//[System.Obsolete("OBSOLETED in favor of application/javascript")]
export const Text_Javascript = new Text("javascript");

export const Text_Jcr_Cnd = new Text("jcr-cnd");
export const Text_Markdown = new Text("markdown");
export const Text_Mizar = new Text("mizar");
export const Text_N3 = new Text("n3", "n3");
export const Text_Parameters = new Text("parameters");
export const Text_Parityfec = new Text("parityfec");
export const Text_Plain = new Text("plain", "txt", "text", "conf", "def", "list", "log", "in");
export const Text_Provenance_Notation = new Text("provenance-notation");
export const Text_PrsFallensteinRst = new Text("prs.fallenstein.rst");
export const Text_PrsLinesTag = new Text("prs.lines.tag", "dsc");
export const Text_PrsPropLogic = new Text("prs.prop.logic");
export const Text_Raptorfec = new Text("raptorfec");
export const Text_RED = new Text("red");
export const Text_Rfc822_Headers = new Text("rfc822-headers");
export const Text_Richtext = new Text("richtext", "rtx");
export const Text_Rtf = new Text("rtf");
export const Text_Rtp_Enc_Aescm128 = new Text("rtp-enc-aescm128");
export const Text_Rtploopback = new Text("rtploopback");
export const Text_Rtx = new Text("rtx");
export const Text_Sgml = new Text("sgml", "sgml", "sgm");
export const Text_Strings = new Text("strings");
export const Text_T140 = new Text("t140");
export const Text_Tab_Separated_Values = new Text("tab-separated-values", "tsv");
export const Text_Troff = new Text("troff", "t", "tr", "roff", "man", "me", "ms");
export const Text_Turtle = new Text("turtle", "ttl");
export const Text_Ulpfec = new Text("ulpfec");
export const Text_Uri_List = new Text("uri-list", "uri", "uris", "urls");
export const Text_Vcard = new Text("vcard", "vcard");
export const Text_Vendor1d_Interleaved_Parityfec = new Text("1d-interleaved-parityfec");
export const Text_VendorA = new Text("vnd.a");
export const Text_VendorAbc = new Text("vnd.abc");
export const Text_VendorAscii_Art = new Text("vnd.ascii-art");
export const Text_VendorCurl = new Text("vnd.curl", "curl");
export const Text_VendorCurlDcurl = new Text("vnd.curl.dcurl", "dcurl");
export const Text_VendorCurlMcurl = new Text("vnd.curl.mcurl", "mcurl");
export const Text_VendorCurlScurl = new Text("vnd.curl.scurl", "scurl");
export const Text_VendorDebianCopyright = new Text("vnd.debian.copyright");
export const Text_VendorDMClientScript = new Text("vnd.dmclientscript");
export const Text_VendorDvbSubtitle = new Text("vnd.dvb.subtitle", "sub");
export const Text_VendorEsmertecTheme_Descriptor = new Text("vnd.esmertec.theme-descriptor");
export const Text_VendorFiclabFlt = new Text("vnd.ficlab.flt");
export const Text_VendorFly = new Text("vnd.fly", "fly");
export const Text_VendorFmiFlexstor = new Text("vnd.fmi.flexstor", "flx");
export const Text_VendorGml = new Text("vnd.gml");
export const Text_VendorGraphviz = new Text("vnd.graphviz", "gv");
export const Text_VendorHgl = new Text("vnd.hgl");
export const Text_VendorIn3d3dml = new Text("vnd.in3d.3dml", "3dml");
export const Text_VendorIn3dSpot = new Text("vnd.in3d.spot", "spot");
export const Text_VendorIPTCNewsML = new Text("vnd.iptc.newsml");
export const Text_VendorIPTCNITF = new Text("vnd.iptc.nitf");
export const Text_VendorLatex_Z = new Text("vnd.latex-z");
export const Text_VendorMotorolaReflex = new Text("vnd.motorola.reflex");
export const Text_VendorMs_Mediapackage = new Text("vnd.ms-mediapackage");
export const Text_VendorNet2phoneCommcenterCommand = new Text("vnd.net2phone.commcenter.command");
export const Text_VendorRadisysMsml_Basic_Layout = new Text("vnd.radisys.msml-basic-layout");
export const Text_VendorSenxWarpscript = new Text("vnd.senx.warpscript");

//[System.Obsolete("OBSOLETED by request")]
export const Text_VendorSiUricatalogue = new Text("vnd.si.uricatalogue");

export const Text_VendorSosi = new Text("vnd.sosi");
export const Text_VendorSunJ2meApp_Descriptor = new Text("vnd.sun.j2me.app-descriptor", "jad");
export const Text_VendorTrolltechLinguist = new Text("vnd.trolltech.linguist");
export const Text_VendorWapSi = new Text("vnd.wap.si");
export const Text_VendorWapSl = new Text("vnd.wap.sl");
export const Text_VendorWapWml = new Text("vnd.wap.wml", "wml");
export const Text_VendorWapWmlscript = new Text("vnd.wap.wmlscript", "wmls");
export const Text_Vtt = new Text("vtt");
export const Text_X_Asm = new Text("x-asm", "s", "asm");
export const Text_X_C = new Text("x-c", "c", "cc", "cxx", "cpp", "h", "hh", "dic");
export const Text_X_Fortran = new Text("x-fortran", "f", "for", "f77", "f90");
export const Text_X_Java_Source = new Text("x-java-source", "java");
export const Text_X_Nfo = new Text("x-nfo", "nfo");
export const Text_X_Opml = new Text("x-opml", "opml");
export const Text_X_Pascal = new Text("x-pascal", "p", "pas");
export const Text_X_Setext = new Text("x-setext", "etx");
export const Text_X_Sfv = new Text("x-sfv", "sfv");
export const Text_X_Uuencode = new Text("x-uuencode", "uu");
export const Text_X_Vcalendar = new Text("x-vcalendar", "vcs");
export const Text_X_Vcard = new Text("x-vcard", "vcf");
export const Text_Xml = new Text("xml");
export const Text_Xml_External_Parsed_Entity = new Text("xml-external-parsed-entity");



export const anyVideo = new Video("*");
export const Video_BMPEG = new Video("bmpeg");
export const Video_BT656 = new Video("bt656");
export const Video_CelB = new Video("celb");
export const Video_DV = new Video("dv");
export const Video_Encaprtp = new Video("encaprtp");
export const Video_Example = new Video("example");
export const Video_Flexfec = new Video("flexfec");
export const Video_H261 = new Video("h261", "h261");
export const Video_H263 = new Video("h263", "h263");
export const Video_H263_1998 = new Video("h263-1998");
export const Video_H263_2000 = new Video("h263-2000");
export const Video_H264 = new Video("h264", "h264");
export const Video_H264_RCDO = new Video("h264-rcdo");
export const Video_H264_SVC = new Video("h264-svc");
export const Video_H265 = new Video("h265");
export const Video_IsoSegment = new Video("iso.segment");
export const Video_JPEG = new Video("jpeg", "jpgv");
export const Video_Jpeg2000 = new Video("jpeg2000");
export const Video_Jpm = new Video("jpm", "jpm", "jpgm");
export const Video_Mj2 = new Video("mj2", "mj2", "mjp2");
export const Video_MP1S = new Video("mp1s");
export const Video_MP2P = new Video("mp2p");
export const Video_MP2T = new Video("mp2t");
export const Video_Mp4 = new Video("mp4", "mp4", "mp4v", "mpg4");
export const Video_MP4V_ES = new Video("mp4v-es");
export const Video_Mpeg = new Video("mpeg", "mpeg", "mpg", "mpe", "m1v", "m2v");
export const Video_Mpeg4_Generic = new Video("mpeg4-generic");
export const Video_MPV = new Video("mpv");
export const Video_Nv = new Video("nv");
export const Video_Ogg = new Video("ogg", "ogv");
export const Video_Parityfec = new Video("parityfec");
export const Video_Pointer = new Video("pointer");
export const Video_Quicktime = new Video("quicktime", "qt", "mov");
export const Video_Raptorfec = new Video("raptorfec");
export const Video_Raw = new Video("raw");
export const Video_Rtp_Enc_Aescm128 = new Video("rtp-enc-aescm128");
export const Video_Rtploopback = new Video("rtploopback");
export const Video_Rtx = new Video("rtx");
export const Video_Smpte291 = new Video("smpte291");
export const Video_SMPTE292M = new Video("smpte292m");
export const Video_Ulpfec = new Video("ulpfec");
export const Video_Vc1 = new Video("vc1");
export const Video_Vc2 = new Video("vc2");
export const Video_Vendor1d_Interleaved_Parityfec = new Video("1d-interleaved-parityfec");
export const Video_Vendor3gpp = new Video("3gpp", "3gp");
export const Video_Vendor3gpp_Tt = new Video("3gpp-tt");
export const Video_Vendor3gpp2 = new Video("3gpp2", "3g2");
export const Video_VendorCCTV = new Video("vnd.cctv");
export const Video_VendorDeceHd = new Video("vnd.dece.hd", "uvh", "uvvh");
export const Video_VendorDeceMobile = new Video("vnd.dece.mobile", "uvm", "uvvm");
export const Video_VendorDeceMp4 = new Video("vnd.dece.mp4");
export const Video_VendorDecePd = new Video("vnd.dece.pd", "uvp", "uvvp");
export const Video_VendorDeceSd = new Video("vnd.dece.sd", "uvs", "uvvs");
export const Video_VendorDeceVideo = new Video("vnd.dece.video", "uvv", "uvvv");
export const Video_VendorDirectvMpeg = new Video("vnd.directv.mpeg");
export const Video_VendorDirectvMpeg_Tts = new Video("vnd.directv.mpeg-tts");
export const Video_VendorDlnaMpeg_Tts = new Video("vnd.dlna.mpeg-tts");
export const Video_VendorDvbFile = new Video("vnd.dvb.file", "dvb");
export const Video_VendorFvt = new Video("vnd.fvt", "fvt");
export const Video_VendorHnsVideo = new Video("vnd.hns.video");
export const Video_VendorIptvforum1dparityfec_1010 = new Video("vnd.iptvforum.1dparityfec-1010");
export const Video_VendorIptvforum1dparityfec_2005 = new Video("vnd.iptvforum.1dparityfec-2005");
export const Video_VendorIptvforum2dparityfec_1010 = new Video("vnd.iptvforum.2dparityfec-1010");
export const Video_VendorIptvforum2dparityfec_2005 = new Video("vnd.iptvforum.2dparityfec-2005");
export const Video_VendorIptvforumTtsavc = new Video("vnd.iptvforum.ttsavc");
export const Video_VendorIptvforumTtsmpeg2 = new Video("vnd.iptvforum.ttsmpeg2");
export const Video_VendorMotorolaVideo = new Video("vnd.motorola.video");
export const Video_VendorMotorolaVideop = new Video("vnd.motorola.videop");
export const Video_VendorMpegurl = new Video("vnd.mpegurl", "mxu", "m4u");
export const Video_VendorMs_PlayreadyMediaPyv = new Video("vnd.ms-playready.media.pyv", "pyv");
export const Video_VendorNokiaInterleaved_Multimedia = new Video("vnd.nokia.interleaved-multimedia");
export const Video_VendorNokiaMp4vr = new Video("vnd.nokia.mp4vr");
export const Video_VendorNokiaVideovoip = new Video("vnd.nokia.videovoip");
export const Video_VendorObjectvideo = new Video("vnd.objectvideo");
export const Video_VendorRadgamettoolsBink = new Video("vnd.radgamettools.bink");
export const Video_VendorRadgamettoolsSmacker = new Video("vnd.radgamettools.smacker");
export const Video_VendorSealedmediaSoftsealMov = new Video("vnd.sealedmedia.softseal.mov");
export const Video_VendorSealedMpeg1 = new Video("vnd.sealed.mpeg1");
export const Video_VendorSealedMpeg4 = new Video("vnd.sealed.mpeg4");
export const Video_VendorSealedSwf = new Video("vnd.sealed.swf");
export const Video_VendorUvvuMp4 = new Video("vnd.uvvu.mp4", "uvu", "uvvu");
export const Video_VendorVivo = new Video("vnd.vivo", "viv");
export const Video_VendorYoutubeYt = new Video("vnd.youtube.yt");
export const Video_VP8 = new Video("vp8");
export const Video_Webm = new Video("webm", "webm");
export const Video_X_F4v = new Video("x-f4v", "f4v");
export const Video_X_Fli = new Video("x-fli", "fli");
export const Video_X_Flv = new Video("x-flv", "flv");
export const Video_X_M4v = new Video("x-m4v", "m4v");
export const Video_X_Matroska = new Video("x-matroska", "mkv", "mk3d", "mks");
export const Video_X_Mng = new Video("x-mng", "mng");
export const Video_X_Ms_Asf = new Video("x-ms-asf", "asf", "asx");
export const Video_X_Ms_Vob = new Video("x-ms-vob", "vob");
export const Video_X_Ms_Wm = new Video("x-ms-wm", "wm");
export const Video_X_Ms_Wmv = new Video("x-ms-wmv", "wmv");
export const Video_X_Ms_Wmx = new Video("x-ms-wmx", "wmx");
export const Video_X_Ms_Wvx = new Video("x-ms-wvx", "wvx");
export const Video_X_Msvideo = new Video("x-msvideo", "avi");
export const Video_X_Sgi_Movie = new Video("x-sgi-movie", "movie");
export const Video_X_Smv = new Video("x-smv", "smv");


export const anyXConference = new XConference("*");
export const XConference_XCooltalk = new XConference("x-cooltalk", "ice");


export const anyXShader = new XShader("*");
export const XShader_XVertex = new XShader("x-vertex", "vert", "glsl");
export const XShader_XFragment = new XShader("x-fragment", "frag", "glsl");