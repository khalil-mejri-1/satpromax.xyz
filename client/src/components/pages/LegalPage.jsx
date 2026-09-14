import React from 'react';
import { useContent } from '../../context/ContentContext';
import { PageHeaderBanner } from '../PageHeaderBanner';
import { IconShieldCheck, IconCheck } from '../Icons';

export const LegalPage = ({ type = 'terms', onNavigate }) => {
  const { currentLang } = useContent();

  const configs = {
    terms: {
      badge: '⚖️ Conditions Légales',
      title: currentLang === 'ar' ? 'شروط الخدمة والاستخدام (CGV/CGU)' : currentLang === 'fr' ? "Conditions Générales de Vente & d'Utilisation" : 'Terms of Service',
      subtitle: currentLang === 'ar' ? 'الشروط والأحكام الخاصة باستعمال خدمات واشتراكات SatProMax.' : currentLang === 'fr' ? 'Règles contractuelles et engagements de qualité de service.' : 'Terms and conditions governing our IPTV streaming service.',
      breadcrumb: 'Conditions Générales',
      sections: [
        {
          title: currentLang === 'ar' ? '1. قبول الشروط' : currentLang === 'fr' ? '1. Acceptation des conditions' : '1. Acceptance of Terms',
          content: currentLang === 'ar' 
            ? 'باستخدامك لموقع وخدمات SatProMax، فإنك توافق على الالتزام بكافة الشروط والأحكام المبينة هنا.' 
            : currentLang === 'fr' 
            ? 'En accédant et en utilisant les services de SatProMax, vous acceptez d’être lié par les présentes conditions générales de vente et d’utilisation.'
            : 'By accessing or using SatProMax services, you agree to comply with and be bound by these terms.'
        },
        {
          title: currentLang === 'ar' ? '2. التوصيل والتفعيل الفوري' : currentLang === 'fr' ? '2. Livraison & Activation' : '2. Automated Delivery',
          content: currentLang === 'ar'
            ? 'يتم تفعيل الاشتراك وتسليم بيانات الدخول فوراً وبشكل تلقائي بعد تأكيد الدفع عبر البريد الإلكتروني أو رسائل واتساب.'
            : currentLang === 'fr'
            ? 'La livraison des identifiants et des codes d’activation est effectuée de manière automatique et instantanée après confirmation de votre paiement.'
            : 'Account credentials and M3U/Xtream codes are delivered automatically immediately following successful payment.'
        },
        {
          title: currentLang === 'ar' ? '3. عدد الشاشات المتزامنة' : currentLang === 'fr' ? '3. Utilisation Multi-Écrans' : '3. Multi-Screen Usage',
          content: currentLang === 'ar'
            ? 'كل اشتراك مخصص لعدد الشاشات المحددة في باقة الشراء (شاشة واحدة، شاشتان، أو 3 شاشات متزامنة). يحظر مشاركة الاشتراك خارج إطار الباقة.'
            : currentLang === 'fr'
            ? 'Chaque abonnement est configuré pour le nombre d’écrans simultanés souscrit (1, 2 ou 3 écrans). L’utilisation abusive ou non autorisée peut entraîner la suspension.'
            : 'Subscriptions must be used strictly within the purchased simultaneous connection limits (1, 2, or 3 devices).'
        }
      ]
    },
    privacy: {
      badge: '🔒 حماية البيانات والخصوصية',
      title: currentLang === 'ar' ? 'سياسة الخصوصية وحماية البيانات' : currentLang === 'fr' ? 'Politique de Confidentialité & Protection des Données' : 'Privacy Policy',
      subtitle: currentLang === 'ar' ? 'التزامنا الكامل بحماية خصوصيتك وسرية بياناتك الشخصية.' : currentLang === 'fr' ? 'Engagement strict de non-partage de vos informations personnelles.' : 'Our strict commitment to protecting your privacy and personal data.',
      breadcrumb: 'Politique de Confidentialité',
      sections: [
        {
          title: currentLang === 'ar' ? '1. البيانات المجمعة' : currentLang === 'fr' ? '1. Données collectées' : '1. Collected Information',
          content: currentLang === 'ar'
            ? 'نحن نجمع فقط المعلومات الضرورية لإتمام طلبك وتقديم الدعم الفني (مثل البريد الإلكتروني ورقم الواتساب للتفعيل).'
            : currentLang === 'fr'
            ? 'Nous ne collectons que les informations strictement nécessaires à la création de votre compte et à votre assistance technique.'
            : 'We only collect essential details required to provision your account and provide direct technical customer support.'
        },
        {
          title: currentLang === 'ar' ? '2. التشفير والأمان 256-Bit' : currentLang === 'fr' ? '2. Chiffrement SSL 256-bit' : '2. 256-Bit SSL Security',
          content: currentLang === 'ar'
            ? 'جميع عمليات الدفع والبيانات مشفرة بأحدث بروتوكولات الأمان SSL 256-bit، ولا نقوم بتخزين أي بيانات لبطاقاتك البنكية.'
            : currentLang === 'fr'
            ? 'Toutes les transactions sont chiffrées de bout en bout via SSL 256-bit. Aucune information bancaire n’est stockée sur nos serveurs.'
            : 'All payment sessions are securely encrypted via 256-bit SSL. We never store credit card or payment information.'
        },
        {
          title: currentLang === 'ar' ? '3. عدم مشاركة البيانات مع أي طرف ثالث' : currentLang === 'fr' ? '3. Confidentialité garantie' : '3. Zero Third-Party Sharing',
          content: currentLang === 'ar'
            ? 'نحن نضمن عدم بيع أو تأجير أو مشاركة بياناتك مع أي طرف خارجي لأي غرض تسويقي.'
            : currentLang === 'fr'
            ? 'Vos données personnelles ne sont jamais vendues, partagées ou transmises à des tiers sous quelque prétexte que ce soit.'
            : 'We never sell, rent, or distribute your private data to third-party advertisers or external entities.'
        }
      ]
    },
    refund: {
      badge: '🛡️ ضمان كامل بدون مخاطرة',
      title: currentLang === 'ar' ? 'سياسة الاسترجاع وضمان 7 أيام' : currentLang === 'fr' ? 'Garantie Satisfait ou Remboursé 7 Jours' : '7-Day Refund Policy & Guarantee',
      subtitle: currentLang === 'ar' ? 'ضمان استرداد كامل المبلغ بنسبة 100% إذا لم تكن راضياً عن الخدمة.' : currentLang === 'fr' ? '100% satisfait ou intégralement remboursé sans justification complexe.' : '100% risk-free trial with full money-back protection within 7 days.',
      breadcrumb: 'Garantie de Remboursement',
      sections: [
        {
          title: currentLang === 'ar' ? '1. شروط الضمان 7 أيام' : currentLang === 'fr' ? '1. Modalités de la garantie 7 jours' : '1. 7-Day Guarantee Period',
          content: currentLang === 'ar'
            ? 'يحق لكل عميل جديد طلب استرداد المبلغ بالكامل خلال 7 أيام من تاريخ الشراء إذا لم تكن الخدمة مطابقة لتوقعاتك.'
            : currentLang === 'fr'
            ? 'Tout nouveau client dispose d’un délai de 7 jours après la souscription pour demander un remboursement complet en cas d’insatisfaction.'
            : 'All new customers are eligible for a 100% complete refund within 7 days of purchase if service expectations are not met.'
        },
        {
          title: currentLang === 'ar' ? '2. سرعة معالجة الاسترداد' : currentLang === 'fr' ? '2. Délais de remboursement' : '2. Fast Processing Time',
          content: currentLang === 'ar'
            ? 'تتم معالجة طلبات الاسترجاع في غضون 24 إلى 48 ساعة وإعادتها لنفس طريقة الدفع المستخدمة.'
            : currentLang === 'fr'
            ? 'Les demandes de remboursement sont traitées sous 24 à 48 heures ouvrées vers votre moyen de paiement d’origine.'
            : 'Refund requests are processed quickly within 24 to 48 hours back to your original payment method.'
        },
        {
          title: currentLang === 'ar' ? '3. كيفية تقديم الطلب' : currentLang === 'fr' ? '3. Comment faire une demande' : '3. How to Request',
          content: currentLang === 'ar'
            ? 'يكفي التواصل مع فريق الدعم عبر الواتساب أو البريد الإلكتروني مع ذكر رقم الطلب وسيتم التنفيذ مباشرة.'
            : currentLang === 'fr'
            ? 'Contactez simplement notre support client par WhatsApp ou e-mail en mentionnant votre référence de commande.'
            : 'Simply contact our 24/7 WhatsApp or email support with your order reference number.'
        }
      ]
    }
  };

  const currentCfg = configs[type] || configs.terms;

  return (
    <div className="standalone-page-wrapper legal-page-wrapper animate-fade-in">
      <PageHeaderBanner 
        badge={currentCfg.badge}
        title={currentCfg.title}
        subtitle={currentCfg.subtitle}
        breadcrumbs={[{ label: currentCfg.breadcrumb }]}
        onNavigate={onNavigate}
      />

      <div className="page-body-container">
        {/* Quick Nav Tabs between Legal Pages */}
        <div className="legal-tabs-bar">
          <button 
            type="button" 
            className={`legal-tab-btn ${type === 'terms' ? 'active' : ''}`}
            onClick={() => onNavigate && onNavigate('terms')}
          >
            {currentLang === 'ar' ? 'الشروط والأحكام' : currentLang === 'fr' ? 'Conditions Générales' : 'Terms of Service'}
          </button>
          <button 
            type="button" 
            className={`legal-tab-btn ${type === 'privacy' ? 'active' : ''}`}
            onClick={() => onNavigate && onNavigate('privacy')}
          >
            {currentLang === 'ar' ? 'سياسة الخصوصية' : currentLang === 'fr' ? 'Politique de Confidentialité' : 'Privacy Policy'}
          </button>
          <button 
            type="button" 
            className={`legal-tab-btn ${type === 'refund' ? 'active' : ''}`}
            onClick={() => onNavigate && onNavigate('refund')}
          >
            {currentLang === 'ar' ? 'ضمان الاسترجاع' : currentLang === 'fr' ? 'Garantie de Remboursement' : 'Refund Policy'}
          </button>
        </div>

        {/* Legal Text Content Card */}
        <div className="legal-content-card">
          <div className="legal-badge-pill">
            <IconShieldCheck size={18} />
            <span>SatProMax Official Policy</span>
          </div>

          <div className="legal-sections-list">
            {currentCfg.sections.map((sec, idx) => (
              <div key={idx} className="legal-section-block">
                <h3 className="legal-section-heading">{sec.title}</h3>
                <p className="legal-section-text">{sec.content}</p>
              </div>
            ))}
          </div>

          <div className="legal-card-footer">
            <button 
              type="button" 
              className="btn-return-home"
              onClick={() => onNavigate && onNavigate('home')}
            >
              ← {currentLang === 'ar' ? 'العودة إلى الصفحة الرئيسية' : currentLang === 'fr' ? "Retour à l'accueil" : 'Return to Home'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
